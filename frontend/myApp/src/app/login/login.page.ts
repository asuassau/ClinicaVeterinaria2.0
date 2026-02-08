// frontend/src/app/login/login.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // IMPORTANTE


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  ]
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';
  admin = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.loading = true;
    this.errorMsg = '';
    this.authService.login(this.email, this.password).subscribe({
     next: (response: any) => {
  this.loading = false;

  if (response?.access_token) {
    this.authService.saveSession(response);

    const rol = this.authService.getUserRole();
    switch (rol) {
      case 'admin': this.router.navigate(['/admin']); break;
      case 'veterinario': this.router.navigate(['/animales']); break;
      case 'recepcionista': this.router.navigate(['/citas-clientes']); break;
      case 'cliente': this.router.navigate(['/mis-animales']); break;
      default: this.router.navigate(['/login']);
    }
  } else {
    this.errorMsg = 'Respuesta inesperada del servidor.';
  }
},
      error: (error) => {
        this.loading = false;
        this.errorMsg = error.error?.message || 'Credenciales incorrectas o error de red.';
      }
    });
  }
}  