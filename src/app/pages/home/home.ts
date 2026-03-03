import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodCard } from '../../components/food-card/food-card';
import { Food } from '../../interfaces/food.interface';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FoodCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private foodService = inject(FoodSupabaseService);
  foods: Food[] = [];

  async ngOnInit() {
    await this.loadFoods();
  }

  async loadFoods() {
    const data = await this.foodService.getFood();
    if (data) {
      this.foods = data as Food[];
    }
  }
}
