import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoSupabaseService } from '../../core/services/carrito-supabase.service';
import { CarritoItem } from '../../interfaces/carrito.interface';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-carrito',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './carrito.html',
    styles: ``
})
export class Carrito implements OnInit {
    private carritoService = inject(CarritoSupabaseService);

    public items: CarritoItem[] = [];
    public totalCarrito: number = 0;

    ngOnInit() {
        this.loadCarrito();

        // Refresh when items are added/removed elsewhere
        this.carritoService.refresh$.subscribe(() => {
            this.loadCarrito();
        });
    }

    async loadCarrito() {
        this.items = await this.carritoService.getCarritoItems();
        this.calculateTotal();
    }

    calculateTotal() {
        this.totalCarrito = this.items.reduce((acc, item) => acc + (item.total * item.quantity), 0);
    }

    async updateQuantity(item: CarritoItem, change: number) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
            this.removeItem(item);
            return;
        }

        const success = await this.carritoService.updateItem(item.id!, {
            quantity: newQuantity
        });

        if (success) {
            item.quantity = newQuantity;
            this.calculateTotal();
        }
    }

    async removeItem(item: CarritoItem) {
        const result = await Swal.fire({
            title: '¿Eliminar platillo?',
            text: `¿Estás seguro de que quieres quitar ${item.food?.name} del carrito?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#a8a29e',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const success = await this.carritoService.removeItem(item.id!);
            if (success) {
                this.loadCarrito();
                Swal.fire({
                    title: 'Eliminado',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        }
    }

    async checkout() {
        Swal.fire({
            title: '¡Pedido realizado!',
            text: 'Tu orden ha sido enviada a la cocina.',
            icon: 'success',
            confirmButtonColor: '#ef4444'
        });

        await this.carritoService.clearCarrito();
        this.loadCarrito();
    }
}
