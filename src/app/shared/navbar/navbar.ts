import { Component, signal, inject } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, JsonPipe],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  private fb = inject(FormBuilder);
  isModalOpen = signal(false);

  // el form para la comida
  formfood: FormGroup = this.fb.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    category: ['', Validators.required],
    available: [true],
    description: ['', Validators.required],
    url_img: ['', Validators.required]
  });

  saveFood() {
    if (this.formfood.invalid) {
      this.formfood.markAllAsTouched();
      return;
    }

    const foodData = this.formfood.value;
    console.log('comida guardada:', foodData);

    this.formfood.reset({ available: true });
    this.isModalOpen.set(false);
  }
}
