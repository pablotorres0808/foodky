import { Component, signal, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FoodSupabaseService } from '../../core/services/food-supabase.service';
import { NewFood } from '../../interfaces/food.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  private fb = inject(FormBuilder);
  private foodService = inject(FoodSupabaseService);
  isModalOpen = signal(false);

  formfood: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    price: ['', [Validators.required, Validators.min(1)]],
    category: ['', Validators.required],
    available: [true],
    description: ['', [Validators.required, Validators.minLength(15)]],
    url_img: ['', Validators.required]
  });

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

    // preparamos el objeto para supabase (sin id ni created_at)
    const { name, description, price, url_img, category } = this.formfood.value;
    const newFood: NewFood = {
      name,
      description,
      price,
      url_img,
      category
    };

    console.log('valor del formulario', newFood, 'newfood supabase', 'post food');

    // guardamos en supabase
    const result = await this.foodService.insertFood(newFood);

    if (result) {
      Swal.fire({
        title: '¡Platillo guardado!',
        text: `El platillo "${name}" se ha registrado correctamente.`,
        icon: 'success',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        color: '#1c1917',
        width: '32rem',
        customClass: {
          popup: 'rounded-[2.5rem]',
          confirmButton: 'rounded-2xl px-6 py-3 font-bold'
        }
      });

      // Cerramos el modal e inicializamos el form después de guardar
      this.isModalOpen.set(false);
      this.formfood.reset({ available: true });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo guardar el platillo. Intenta de nuevo.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-[2.5rem]',
          confirmButton: 'rounded-2xl px-6 py-3 font-bold'
        }
      });
    }
  }
}
