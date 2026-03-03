import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class FoodSupabaseService {
    private supabase: SupabaseClient;

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

    async getFood() {
        let { data, error } = await this.supabase
            .from('foods')
            .select('*');

        if (error) {
            console.error('Error fetching foods:', error);
            return [];
        }

        console.log(data);
        return data;
    }
}
