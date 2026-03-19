import { Food } from './food.interface';

export interface CarritoItem {
    id?: number;
    created_at?: string;
    quantity: number;
    total: number;
    options?: any;
    id_food: number;
    food?: Food; // Optional joined food data
}

export interface NewCarritoItem {
    quantity: number;
    total: number;
    options?: any;
    id_food: number;
}
