import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodCard } from '../../components/food-card/food-card';
import { Food } from '../../interfaces/food.interface';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FoodCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private supabase = inject(SupabaseService);
  foods = signal<Food[]>([]);

  async ngOnInit() {
    await this.getFoods();
  }

  async getFoods() {
    const { data, error } = await this.supabase.client
      .from('foods')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching foods:', error);
      return;
    }

    if (data) {
      this.foods.set(data);
    }
  }
}
