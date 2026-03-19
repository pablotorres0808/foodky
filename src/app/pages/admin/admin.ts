import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';
import { ModalService } from '../../core/services/modal.service';
import { Food } from '../../interfaces/food.interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin.html',
})
export class Admin implements OnInit {
    private foodService = inject(FoodSupabaseService);
    public modalService = inject(ModalService);
    private destroyRef = inject(DestroyRef);
    foods: Food[] = [];

    async ngOnInit() {
        await this.loadFoods();

        // Actualización reactiva
        this.foodService.refresh$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.loadFoods();
            });
    }

    async loadFoods() {
        const data = await this.foodService.getFood();
        if (data) {
            this.foods = data as Food[];
        }
    }

    editFood(food: Food) {
        this.modalService.openForEdit(food);
    }

    async deleteFood(food: Food) {
        // ... (remaining of the method)
        if (!food.id) return;

        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: `No podrás revertir la eliminación de "${food.name}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#78716c',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true,
            background: '#ffffff',
            color: '#1c1917',
            width: '32rem',
            backdrop: 'rgba(28,25,23,0.6)',
            customClass: {
                popup: 'rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.1)] border border-gray-100 p-12',
                title: 'text-2xl font-black text-gray-900 tracking-tight mb-2',
                htmlContainer: 'text-gray-500 font-medium',
                confirmButton: 'bg-gradient-to-r from-red-500 to-red-600 rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] text-white transition-all duration-300 active:scale-95 shadow-lg shadow-red-500/25 border-0 hover:from-orange-500 hover:to-orange-600 ml-4',
                cancelButton: 'bg-stone-100 text-stone-600 rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] transition-all duration-300 active:scale-95 border-0 hover:bg-stone-200 hover:text-stone-900'
            }
        });

        if (result.isConfirmed) {
            await this.foodService.deleteFood(food.id);
            this.foods = this.foods.filter(f => f.id !== food.id);

            Swal.fire({
                title: '¡Eliminado!',
                text: `El platillo "${food.name}" ha sido borrado correctamente.`,
                icon: 'success',
                confirmButtonColor: '#ef4444',
                background: '#ffffff',
                color: '#1c1917',
                width: '32rem',
                backdrop: 'rgba(28,25,23,0.6)',
                customClass: {
                    popup: 'rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.1)] border border-gray-100 p-12',
                    title: 'text-2xl font-black text-gray-900 tracking-tight mb-2',
                    htmlContainer: 'text-gray-500 font-medium',
                    confirmButton: 'bg-gradient-to-r from-red-500 to-red-600 rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] text-white transition-all duration-300 active:scale-95 shadow-lg shadow-red-500/25 border-0 hover:from-orange-500 hover:to-orange-600'
                }
            });
        }
    }
}
