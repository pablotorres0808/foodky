import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './navbar.html',
  styles: ``,
})
export class Navbar {
  private fb = inject(FormBuilder);
  isModalOpen = signal(false);

  formfood: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required, Validators.pattern('[A-Za-zÀ-ÿ\\s]+')]],
    available: [true],
    description: [''],
    url_img: ['']
  });

  saveFood() {
    if (this.formfood.invalid) {
      this.formfood.markAllAsTouched();
      return;
    }

    const foodData = this.formfood.value;
    // Simulate saving the food here
    console.log('Food saved locally (mock with Reactive Form):', foodData);

    // Reset and close the modal
    this.formfood.reset({ available: true });
    this.isModalOpen.set(false);
  }
}
