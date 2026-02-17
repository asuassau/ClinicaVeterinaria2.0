import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService, CreateUsuarioDto, Role } from '../../services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';
import type { Role as AppRole } from 'src/app/seguridad/permisos';

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
    private router: Router,
    private permisos: PermisosService
  ) {}

  // ===== role actual =====
  get role(): AppRole {
    return this.permisos.role();
  }

  // ===== permisos =====
  get canNuevo(): boolean {
    // Para usuarios, el “nuevo” de vet/recep depende de ctx.esCliente,
    // pero en form SIEMPRE vamos a crear cliente para ellos.
    const esClienteTarget = this.role === 'administrador' ? (this.form.rol === 'cliente') : true;
    return this.permisos.can('usuarios', 'nuevo', { esCliente: esClienteTarget });
  }

  // Admin puede elegir rol; resto NO
  get canElegirRol(): boolean {
    return this.role === 'administrador';
  }

  ionViewWillEnter() {
    if (!this.canNuevo) {
      this.router.navigate(['/menu']);
      return;
    }

    // si no es admin, forzamos el rol a cliente siempre
    if (!this.canElegirRol) {
      this.form.rol = 'cliente';
    }
  }

  onRolChange() {
    // si no es admin, blinda
    if (!this.canElegirRol) {
      this.form.rol = 'cliente';
      return;
    }

    // admin: si elige un rol NO cliente, el permiso “nuevo” podría ser false
    // (según tu permisos.ts, admin siempre true, pero lo dejamos por robustez)
    if (!this.canNuevo) {
      this.form.rol = 'cliente';
    }
  }

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';

    if (!this.canNuevo) {
      this.router.navigate(['/menu']);
      return;
    }

    // ✅ Blinda: vet/recep solo crean cliente
    const payload: CreateUsuarioDto = {
      ...this.form,
      nombre: (this.form.nombre || '').trim(),
      apellidos: (this.form.apellidos || '').trim(),
      email: (this.form.email || '').trim(),
      nif: (this.form.nif || '').trim(),
      telefono: (this.form.telefono || '').trim(),
      direccion: (this.form.direccion || '').trim(),
      contrasena: (this.form.contrasena || '').trim(),
      rol: this.canElegirRol ? (this.form.rol as Role) : ('cliente' as Role),
    };

    if (!payload.nombre) {
      this.errorMsg = 'El nombre es obligatorio.';
      return;
    }
    if (!payload.email) {
      this.errorMsg = 'El email es obligatorio.';
      return;
    }
    if (!payload.contrasena || payload.contrasena.length < 4) {
      this.errorMsg = 'La contraseña es obligatoria (mín. 4 caracteres).';
      return;
    }

    this.loading = true;

    this.usuarioService.createUsuario(payload).subscribe({
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
