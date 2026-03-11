import { Injectable, signal } from '@angular/core';
import { Food } from '../../interfaces/food.interface';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    isOpen = signal(false);
    editingFood = signal<Food | null>(null);

    openForAdd() {
        this.editingFood.set(null);
        this.isOpen.set(true);
    }

    openForEdit(food: Food) {
        this.editingFood.set(food);
        this.isOpen.set(true);
    }

    close() {
        this.isOpen.set(false);
        this.editingFood.set(null);
    }
}
