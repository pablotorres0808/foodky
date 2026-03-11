import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
}
