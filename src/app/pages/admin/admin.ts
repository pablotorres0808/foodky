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
            customClass: {
                popup: 'rounded-[2.5rem]',
                confirmButton: 'rounded-2xl px-6 py-3 font-bold',
                cancelButton: 'rounded-2xl px-6 py-3 font-bold'
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
                width: '32rem',
                customClass: {
                    popup: 'rounded-[2.5rem]',
                    confirmButton: 'rounded-2xl px-6 py-3 font-bold'
                }
            });
        }
    }
}
