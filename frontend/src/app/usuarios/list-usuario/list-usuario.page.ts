import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario, UsuarioService, Role } from '../../services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';
import { AuthService } from 'src/app/services/auth.service';

import type { Role as AppRole } from 'src/app/seguridad/permisos';

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
    private router: Router,
    private permisos: PermisosService,
    private auth: AuthService
  ) {}

  // ====== Role actual ======
  get role(): AppRole {
    return this.permisos.role();
  }

  // Vet/Recep: solo clientes
  get soloClientes(): boolean {
    return this.role === 'veterinario' || this.role === 'recepcionista';
  }

  private esCliente(u: Usuario): boolean {
    return (u.rol as any) === 'cliente';
  }

  // ====== Permisos generales ======
  get canNuevo(): boolean {
    // En usuarios, para Vet/Recep la creación es "solo clientes".
    // Pasamos ctx.esCliente=true para habilitar el botón, y en el form se forzará rol=cliente.
    return this.permisos.can('usuarios', 'nuevo', { esCliente: true });
  }

  // por fila
  canEliminarUsuario(u: Usuario): boolean {
    return this.permisos.can('usuarios', 'eliminar', { esCliente: this.esCliente(u) });
  }

  canVerUsuario(u: Usuario): boolean {
    return this.permisos.can('usuarios', 'ver', { esCliente: this.esCliente(u) });
  }

  ionViewWillEnter() {
    // no tiene permiso de ver usuarios
    if (!this.permisos.can('usuarios', 'ver')) {
      this.router.navigate(['/menu']);
      return;
    }

    // Cliente: no debe ver listado -> ir a su ficha
    if (this.role === 'cliente') {
      const me: any = (this.auth as any).getUser?.();
      const myId = Number(me?.idUsuario);
      if (myId) this.router.navigate(['/edit-usuario', myId]);
      else this.router.navigate(['/menu']);
      return;
    }

    // Vet/Recep: forzar filtro a clientes
    if (this.soloClientes) {
      this.filtroRol = 'cliente';
    }

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.errorMsg = '';

    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data || [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios';
      }
    });
  }

  aplicarFiltros() {
    const nombreFiltro = (this.filtroNombre || '').toLowerCase().trim();

    this.usuariosFiltrados = (this.usuarios || []).filter(u => {

      // ✅ Vet/Recep: forzado solo clientes
      const coincideRol =
        this.soloClientes
          ? u.rol === 'cliente'
          : (this.filtroRol === 'todos' ? true : u.rol === this.filtroRol);

      const textoUsuario =
        `${u.nombre ?? ''} ${u.apellidos ?? ''} ${u.email ?? ''}${u.nif}`.toLowerCase();

      const coincideNombre =
        nombreFiltro === '' ? true : textoUsuario.includes(nombreFiltro);

      return coincideRol && coincideNombre;
    });
  }

  limpiarFiltros() {
    // ✅ no permitir salir de "cliente" si vet/recep
    this.filtroRol = this.soloClientes ? 'cliente' : 'todos';
    this.filtroNombre = '';
    this.aplicarFiltros();
  }

  eliminarUsuario(usuario: Usuario) {
    if (!this.canEliminarUsuario(usuario)) return;

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
    if (!this.canVerUsuario(usuario)) return;
    this.router.navigate(['/edit-usuario', usuario.idUsuario]);
  }

  crearUsuario() {
    if (!this.canNuevo) return;
    this.router.navigate(['/form-usuario']);
  }

  volver() {
    this.router.navigate(['/menu']);  
  }
}
