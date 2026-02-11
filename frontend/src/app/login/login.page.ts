import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  email = '';
  password = '';
  loading = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    this.loading = true;
    this.errorMsg = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.loading = false;

        if (response?.access_token) {
          this.authService.saveSession(response);
          this.router.navigate(['/menu']);
        } else {
          this.errorMsg = 'Respuesta inesperada del servidor.';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMsg =
          error.error?.message || 'Credenciales incorrectas o error de red.';
      }
    });
  }
}
