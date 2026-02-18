import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Food } from '../../interfaces/food.interface';

@Component({
  selector: 'app-food-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './food-card.html',
  styles: ``,
})
export class FoodCard {
  @Input({ required: true }) food!: Food;
}
