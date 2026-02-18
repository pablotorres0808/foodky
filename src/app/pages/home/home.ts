import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodCard } from '../../components/food-card/food-card';
import { Food } from '../../interfaces/food.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FoodCard],
  templateUrl: './home.html',
})
export class Home {
  sampleFood: Food = {
    id: 1,
    name: 'Pizza Pepperoni Premium',
    description: 'Nuestra combinación secreta de quesos italianos, pepperoni madurado y salsa de tomate San Marzano hecha en casa.',
    price: 245,
    category: 'Gourmet',
    img_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    is_available: true
  };

  // Duplicating the card 8 times to create two rows of 4 on desktop
  foods: Food[] = Array(8).fill({ ...this.sampleFood });
}
