import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';
import { NewFood } from '../../interfaces/food.interface';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FoodSupabaseService {
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

        this.getFood();
    }

    notifyRefresh() {
        this.refresh$.next();
    }

    async getFood() {
        let { data, error } = await this.supabase
            .from('foods')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('Error fetching foods:', error);
            return [];
        }

        console.log(data);
        return data;
    }

    async insertFood(newFood: NewFood) {
        const { data, error } = await this.supabase
            .from('foods')
            .insert([newFood])
            .select();

        if (error) {
            console.error('Error inserting food:', error);
            return null;
        }

        return data;
    }

    async deleteFood(id: number) {
        const { data, error } = await this.supabase
            .from('foods')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting food:', error);
            return null;
        }

        this.notifyRefresh();
        return data;
    }

    async updateFood(id: number, food: NewFood) {
        const { data, error } = await this.supabase
            .from('foods')
            .update(food)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating food:', error);
            return null;
        }

        return data;
    }
}
