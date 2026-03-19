import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Food } from '../../interfaces/food.interface';
import { CarritoSupabaseService } from '../../core/services/carrito-supabase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-card.html',
  styles: ``,
})
export class FoodCard {
  @Input({ required: true }) food!: Food;

  private carritoService = inject(CarritoSupabaseService);

  async addToCarrito() {
    if (!this.food.available) return;

    // First check if it already exists
    const existingItem = await this.carritoService.getExistingItem(this.food.id);
    
    if (existingItem) {
      // If it exists, update quantity and total without alert
      console.log('Ya está en el carrito, se suma la cantidad');
      await this.carritoService.updateItem(existingItem.id!, {
        quantity: existingItem.quantity + 1,
        total: Number(existingItem.total) + Number(this.food.price)
      });
      return;
    }

    const result = await this.carritoService.addItem({
      id_food: this.food.id,
      quantity: 1,
      total: this.food.price,
      options: {}
    });

    if (result) {
      Swal.fire({
        title: '¡Añadido!',
        text: `${this.food.name} se ha añadido al carrito`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        position: 'top-end',
        toast: true
      });
    }
  }
}
