import { Component, signal, inject, effect, OnInit } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';
import { CarritoSupabaseService } from '../../core/services/carrito-supabase.service';
import { ModalService } from '../../core/services/modal.service';
import { Food, NewFood } from '../../interfaces/food.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar implements OnInit {
  private fb = inject(FormBuilder);
  private foodService = inject(FoodSupabaseService);
  private carritoService = inject(CarritoSupabaseService);
  public modalService = inject(ModalService);

  public cartItemsCount = signal<number>(0);

  formfood: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    price: ['', [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    available: [true],
    description: ['', [Validators.required, Validators.minLength(15)]],
    url_img: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const food = this.modalService.editingFood();
      if (food) {
        this.formfood.patchValue(food);
      } else {
        this.formfood.reset({ available: true });
      }
    });
  }

  ngOnInit() {
    this.loadCartCount();
    this.carritoService.refresh$.subscribe(() => {
      this.loadCartCount();
    });
  }

  async loadCartCount() {
    const items = await this.carritoService.getCarritoItems();
    this.cartItemsCount.set(items.length);
  }

  errorMessages: any = {
    name: {
      required: 'Por favor ingresa un nombre',
      minlength: 'El nombre debe tener al menos 5 caracteres'
    },
    price: {
      required: 'Por favor ingresa un precio',
      min: 'El precio debe ser de al menos 1 peso'
    },
    category: {
      required: 'Por favor ingresa una categoría'
    },
    description: {
      required: 'Por favor ingresa una descripción',
      minlength: 'La descripción debe tener al menos 15 caracteres'
    },
    url_img: {
      required: 'Por favor ingresa una URL de imagen'
    }
  };

  isValid(field: string): boolean {
    return !!(this.formfood.get(field)?.invalid && this.formfood.get(field)?.touched);
  }

  getErrorMessage(controlName: string): string {
    const control = this.formfood.get(controlName);

    if (!control || !control.errors || control.pristine) {
      return '';
    }

    console.log(`Errores ${controlName}:`, control.errors);

    for (const errorKey in control.errors) {
      if (control.errors.hasOwnProperty(errorKey)) {
        return this.errorMessages[controlName]?.[errorKey] || 'Error';
      }
    }

    return '';
  }

  async saveFood() {
    if (this.formfood.invalid) {
      this.formfood.markAllAsTouched();
      return;
    }

    const { name, description, price, url_img, category, available } = this.formfood.value;
    const foodData: NewFood = {
      name,
      description,
      price,
      url_img,
      category,
      available
    };

    const editingFood = this.modalService.editingFood();
    let result;

    if (editingFood) {
      result = await this.foodService.updateFood(editingFood.id, foodData);
    } else {
      result = await this.foodService.insertFood(foodData);
    }

    if (result) {
      Swal.fire({
        title: editingFood ? '¡Platillo actualizado!' : '¡Platillo guardado!',
        text: `El platillo "${name}" se ha ${editingFood ? 'actualizado' : 'registrado'} correctamente.`,
        icon: 'success',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1c1917',
        width: '32rem',
        backdrop: 'rgba(28,25,23,0.6)',
        customClass: {
          popup: 'rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.1)] border border-gray-100 p-12',
          title: 'text-2xl font-black text-gray-900 tracking-tight mb-2',
          htmlContainer: 'text-gray-500 font-medium',
          confirmButton: 'bg-gradient-to-r from-red-500 to-red-600 rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] text-white transition-all duration-300 active:scale-95 shadow-lg shadow-red-500/25 border-0 hover:from-orange-500 hover:to-orange-600'
        }
      });

      this.modalService.close();
      this.foodService.notifyRefresh();
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar la solicitud. Intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1c1917',
        width: '32rem',
        backdrop: 'rgba(28,25,23,0.6)',
        customClass: {
          popup: 'rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.1)] border border-gray-100 p-12',
          title: 'text-2xl font-black text-gray-900 tracking-tight mb-2',
          htmlContainer: 'text-gray-500 font-medium',
          confirmButton: 'bg-gradient-to-r from-red-500 to-red-600 rounded-2xl px-8 py-4 font-black uppercase tracking-widest text-[10px] text-white transition-all duration-300 active:scale-95 shadow-lg shadow-red-500/25 border-0 hover:from-orange-500 hover:to-orange-600'
        }
      });
    }
  }
}
