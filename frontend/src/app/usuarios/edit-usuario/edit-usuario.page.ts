import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, Usuario, UpdateUsuarioDto, Role } from '../../services/usuario.service';

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

  // usuario real (para mostrar en modo detalle)
  usuario: Usuario | null = null;

  // modo vista/edición
  editMode = false;

  // formulario (solo para edición)
  form: UpdateUsuarioDto = {
    nombre: '',
    apellidos: '',
    email: '',
    rol: 'cliente',
    nif: '',
    telefono: '',
    direccion: '',
    contrasena: '', // solo se usará si se rellena
  };

  roles: Role[] = ['administrador', 'veterinario', 'recepcionista', 'cliente'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.idUsuario = id ? Number(id) : NaN;

    if (!this.idUsuario || Number.isNaN(this.idUsuario)) {
      this.errorMsg = 'ID de usuario inválido.';
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
        this.rellenarFormDesdeUsuario(u);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando el usuario';
      },
    });
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
      // contraseña SIEMPRE vacía y solo se manda si el usuario la rellena
      contrasena: '',
    };
  }

  activarEdicion() {
    if (!this.usuario) return;
    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
    // asegúrate de que el form está sincronizado y contraseña vacía
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

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    // armamos payload sin contrasena si viene vacía
    const payload: UpdateUsuarioDto = {
      nombre: this.form.nombre?.trim(),
      apellidos: this.form.apellidos?.trim(),
      email: this.form.email?.trim(),
      rol: this.form.rol,
      nif: this.form.nif?.trim(),
      telefono: this.form.telefono?.trim(),
      direccion: this.form.direccion?.trim(),
    };

    const pass = (this.form.contrasena ?? '').trim();
    if (pass.length > 0) {
      payload.contrasena = pass;
    }

    this.usuarioService.updateUsuario(this.idUsuario, payload).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Usuario actualizado correctamente';
        this.editMode = false;
        // recarga para ver cambios reflejados
        this.cargarUsuario();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error actualizando usuario';
      },
    });
  }

  volver() {
    this.router.navigate(['/list-usuario']);
  }
}
