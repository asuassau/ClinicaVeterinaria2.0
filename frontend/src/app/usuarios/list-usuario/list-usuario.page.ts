import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioService, Role } from '../../services/usuario.service';

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.page.html',
  styleUrls: ['./list-usuario.page.scss'],
  standalone: false,
})
export class ListUsuarioPage {

  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  filtroRol: Role | 'todos' = 'todos';
  filtroNombre: string = '';

  loading = false;
  errorMsg = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.errorMsg = '';

    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Error cargando usuarios';
      }
    });
  }

  aplicarFiltros() {
    const nombreFiltro = this.filtroNombre.toLowerCase().trim();

    this.usuariosFiltrados = this.usuarios.filter(u => {

      const coincideRol =
        this.filtroRol === 'todos' ? true : u.rol === this.filtroRol;

      const textoUsuario =
        `${u.nombre ?? ''} ${u.apellidos ?? ''} ${u.email ?? ''}`.toLowerCase();

      const coincideNombre =
        nombreFiltro === '' ? true : textoUsuario.includes(nombreFiltro);

      return coincideRol && coincideNombre;
    });
  }

  limpiarFiltros() {
    this.filtroRol = 'todos';
    this.filtroNombre = '';
    this.aplicarFiltros();
  }

  eliminarUsuario(usuario: Usuario) {
    if (!confirm(`¿Seguro que quieres eliminar a ${usuario.nombre}?`)) return;

    this.usuarioService.deleteUsuario(usuario.idUsuario).subscribe({
      next: () => {
        this.cargarUsuarios();
      },
      error: () => {
        alert('Error eliminando usuario');
      }
    });
  }

  verDetalle(usuario: Usuario) {
    this.router.navigate(['/edit-usuario', usuario.idUsuario]);
  }


  crearUsuario() {
    this.router.navigate(['/form-usuario']);
  }
}
