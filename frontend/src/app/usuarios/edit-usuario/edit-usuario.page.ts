import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, Usuario, UpdateUsuarioDto, Role } from '../../services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';
import { AuthService } from 'src/app/services/auth.service';

import type { Role as AppRole } from 'src/app/seguridad/permisos';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.page.html',
  styleUrls: ['./edit-usuario.page.scss'],
  standalone: false,
})
export class EditUsuarioPage {
  idUsuario!: number;

  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';

  usuario: Usuario | null = null;
  editMode = false;

  form: UpdateUsuarioDto = {
    nombre: '',
    apellidos: '',
    email: '',
    rol: 'cliente',
    nif: '',
    telefono: '',
    direccion: '',
    contrasena: '',
  };

  roles: Role[] = ['administrador', 'veterinario', 'recepcionista', 'cliente'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private permisos: PermisosService,
    private auth: AuthService
  ) {}

  // ===== Role actual =====
  get role(): AppRole {
    return this.permisos.role();
  }

  private get myIdUsuario(): number {
    const me: any = (this.auth as any).getUser?.();
    return Number(me?.idUsuario || 0);
  }

  private esCliente(u: Usuario | null): boolean {
    return (u?.rol as any) === 'cliente';
  }

  // ===== Permisos en esta pantalla (contextuales) =====
get canVerPantalla(): boolean {
  // Cliente: solo su ficha (ctx.esPropietario)
  const esPropietario = this.role === 'cliente'
    ? (this.myIdUsuario > 0 && this.idUsuario === this.myIdUsuario)
    : false;

  return this.permisos.can('usuarios', 'ver', { esPropietario });
}

canEditarUsuarioTarget(): boolean {
  // Cliente: solo puede editar su ficha (ctx.esPropietario)
  const esPropietario = this.role === 'cliente'
    ? (this.myIdUsuario > 0 && this.idUsuario === this.myIdUsuario)
    : false;

  // Vet/Recep: solo clientes (ctx.esCliente)
  const esClienteTarget = this.role === 'veterinario' || this.role === 'recepcionista'
    ? this.esCliente(this.usuario)
    : undefined;

  return this.permisos.can('usuarios', 'editar', {
    esPropietario,
    esCliente: esClienteTarget
  });
}

  // Mostrar selector de rol SOLO si admin
  get canEditarRol(): boolean {
    return this.role === 'administrador';
  }

ionViewWillEnter() {
  const id = this.route.snapshot.paramMap.get('id');
  this.idUsuario = id ? Number(id) : NaN;

  if (!this.idUsuario || Number.isNaN(this.idUsuario)) {
    this.errorMsg = 'ID de usuario inválido.';
    return;
  }

  // ✅ ahora sí: permiso contextual (cliente solo si es su id)
  if (!this.canVerPantalla) {
    this.router.navigate(['/menu']);
    return;
  }

  this.cargarUsuario();
}

  cargarUsuario() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    this.usuarioService.getUsuarioById(this.idUsuario).subscribe({
      next: (u) => {
        this.usuario = u;

        // ✅ aplicar restricciones por rol (cliente solo su ficha, vet/recep solo clientes)
        if (!this.validarAccesoSegunRol(u)) {
          this.router.navigate(['/menu']);
          return;
        }

        this.rellenarFormDesdeUsuario(u);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando el usuario';
      },
    });
  }

  private validarAccesoSegunRol(u: Usuario): boolean {
    // Cliente: solo su ficha
    if (this.role === 'cliente') {
      return this.myIdUsuario > 0 && Number(u.idUsuario) === this.myIdUsuario;
    }

    // Vet / Recep: solo clientes
    if (this.role === 'veterinario' || this.role === 'recepcionista') {
      return this.esCliente(u);
    }

    // Admin: todo
    return true;
  }

  private rellenarFormDesdeUsuario(u: Usuario) {
    this.form = {
      nombre: u.nombre ?? '',
      apellidos: u.apellidos ?? '',
      email: u.email ?? '',
      rol: (u.rol as Role) ?? 'cliente',
      nif: u.nif ?? '',
      telefono: u.telefono ?? '',
      direccion: u.direccion ?? '',
      contrasena: '',
    };
  }

  activarEdicion() {
    if (!this.usuario) return;

    // ✅ si no puede editar este target, no entra
    if (!this.canEditarUsuarioTarget()) return;

    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
    this.rellenarFormDesdeUsuario(this.usuario);
  }

  cancelarEdicion() {
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';
    if (this.usuario) this.rellenarFormDesdeUsuario(this.usuario);
  }

  guardarCambios() {
    if (!this.usuario) return;

    // ✅ permiso contextual (solo clientes para vet/recep)
    if (!this.canEditarUsuarioTarget()) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    // payload base
    const payload: UpdateUsuarioDto = {
      nombre: this.form.nombre?.trim(),
      apellidos: this.form.apellidos?.trim(),
      email: this.form.email?.trim(),
      nif: this.form.nif?.trim(),
      telefono: this.form.telefono?.trim(),
      direccion: this.form.direccion?.trim(),
    };

    // ✅ rol: solo admin puede enviarlo/modificarlo
    if (this.canEditarRol) {
      payload.rol = this.form.rol;
    }

    // contraseña opcional
    const pass = (this.form.contrasena ?? '').trim();
    if (pass.length > 0) {
      payload.contrasena = pass;
    }

    this.usuarioService.updateUsuario(this.idUsuario, payload).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Usuario actualizado correctamente';
        this.editMode = false;
        this.cargarUsuario();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error actualizando usuario';
      },
    });
  }

  volver() {
    // Cliente: normalmente no debería volver a lista
    if (this.role === 'cliente') {
      this.router.navigate(['/menu']);
      return;
    }
    this.router.navigate(['/list-usuario']);
  }
}
