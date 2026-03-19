import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { CarritoItem, NewCarritoItem } from '../../interfaces/carrito.interface';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CarritoSupabaseService {
    private supabase: SupabaseClient;
    public refresh$ = new Subject<void>();

    constructor() {
        this.supabase = createClient(
            environment.supabase.url,
            environment.supabase.publicKey,
            {
                auth: {
                    persistSession: false
                }
            }
        );
    }

    notifyRefresh() {
        this.refresh$.next();
    }

    async getCarritoItems() {
        const { data, error } = await this.supabase
            .from('items_carrito')
            .select('*, food:foods(*)');

        if (error) {
            console.error('Error fetching carrito items:', error);
            return [];
        }

        return data as CarritoItem[];
    }

    async getExistingItem(foodId: number) {
        const { data, error } = await this.supabase
            .from('items_carrito')
            .select('*')
            .eq('id_food', foodId)
            .maybeSingle();

        if (error) {
            console.error('Error getting existing item:', error);
            return null;
        }

        return data as CarritoItem | null;
    }

    async addItem(item: NewCarritoItem) {
        const { data, error } = await this.supabase
            .from('items_carrito')
            .insert([item])
            .select();

        if (error) {
            console.error('Error adding item to carrito:', error);
            return null;
        }

        this.notifyRefresh();
        return data;
    }

    async updateItem(id: number, item: Partial<NewCarritoItem>) {
        const { data, error } = await this.supabase
            .from('items_carrito')
            .update(item)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating carrito item:', error);
            return null;
        }

        this.notifyRefresh();
        return data;
    }

    async removeItem(id: number) {
        const { error } = await this.supabase
            .from('items_carrito')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error removing item from carrito:', error);
            return false;
        }

        this.notifyRefresh();
        return true;
    }

    async clearCarrito() {
        const { error } = await this.supabase
            .from('items_carrito')
            .delete()
            .neq('id', 0); // Delete all

        if (error) {
            console.error('Error clearing carrito:', error);
            return false;
        }

        this.notifyRefresh();
        return true;
    }
}
