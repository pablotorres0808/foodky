import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Admin } from './pages/admin/admin';
import { Carrito } from './pages/carrito/carrito';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'admin', component: Admin },
    { path: 'carrito', component: Carrito }
];
