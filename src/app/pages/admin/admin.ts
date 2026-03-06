import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';
import { Food } from '../../interfaces/food.interface';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin.html',
})
export class Admin implements OnInit {
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
