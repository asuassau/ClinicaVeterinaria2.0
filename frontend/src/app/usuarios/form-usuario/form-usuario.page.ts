import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, CreateUsuarioDto, Role } from '../../services/usuario.service';

@Component({
  selector: 'app-form-usuario',
  templateUrl: './form-usuario.page.html',
  styleUrls: ['./form-usuario.page.scss'],
  standalone: false,
})
export class FormUsuarioPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  // Opcional para el select
  roles: Role[] = ['administrador', 'veterinario', 'recepcionista', 'cliente'];

  form: CreateUsuarioDto = {
    nombre: '',
    apellidos: '',
    email: '',
    rol: 'cliente',
    nif: '',
    telefono: '',
    direccion: '',
    contrasena: '',
  };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';
    this.loading = true;

    this.usuarioService.createUsuario(this.form).subscribe({
      next: () => {
        this.loading = false;
        this.okMsg = 'Usuario creado correctamente';
        setTimeout(() => this.router.navigate(['/list-usuario']), 600);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message || 'Error creando usuario (revisa backend/token).';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-usuario']);
  }
}
