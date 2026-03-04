import { Component, signal, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';
import { NewFood } from '../../interfaces/food.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  private fb = inject(FormBuilder);
  private foodService = inject(FoodSupabaseService);
  isModalOpen = signal(false);

  // el form para la comida
  formfood: FormGroup = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    category: ['', Validators.required],
    available: [true],
    description: ['', Validators.required],
    url_img: ['', Validators.required]
  });

  async saveFood() {
    if (this.formfood.invalid) {
      this.formfood.markAllAsTouched();
      return;
    }

    // preparamos el objeto para supabase (sin id ni created_at)
    const { name, description, price, url_img, category } = this.formfood.value;
    const newFood: NewFood = {
      name,
      description,
      price,
      url_img,
      category
    };

    console.log('valor del formulario', newFood, 'newfood supabase', 'post food');

    // guardamos en supabase
    await this.foodService.insertFood(newFood);

    this.formfood.reset({ available: true });
    this.isModalOpen.set(false);
  }
}
