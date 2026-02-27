import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SupabaseService {
    private supabase: SupabaseClient;

    constructor() {
        this.supabase = createClient(
            environment.supabase.url,
            environment.supabase.publicKey
        );
    }

    // Get the base client for advanced operations
    get client(): SupabaseClient {
        return this.supabase;
    }
}
