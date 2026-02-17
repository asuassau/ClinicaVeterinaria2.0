import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ServicioService,
  Servicio,
  TipoServicio
} from '../../../services/servicio.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


type TipoFiltro = TipoServicio | 'todos';

@Component({
  selector: 'app-list-servicios',
  templateUrl: './list-servicios.page.html',
  styleUrls: ['./list-servicios.page.scss'],
  standalone: false,
})
export class ListServiciosPage {
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];

  // filtros
  filtroTipo: TipoFiltro = 'todos';
  filtroTexto = '';

  loading = false;
  errorMsg = '';

  // para el select
  tiposServicio: TipoServicio[] = ['CONSULTA', 'PRUEBA', 'CIRUGIA', 'VACUNACION'];

  constructor(
    private servicioService: ServicioService,
    private router: Router,
    private permisos: PermisosService

  ) {}

  get canNuevo(): boolean {
  return this.permisos.can('servicios', 'nuevo');
}


get canEliminar(): boolean {
  return this.permisos.can('servicios', 'eliminar');
}

get canVer(): boolean {
  return this.permisos.can('servicios', 'ver');
}

  ionViewWillEnter() {
    this.cargarServicios();
  }

  cargarServicios() {
    this.loading = true;
    this.errorMsg = '';

    this.servicioService.getServicios().subscribe({
      next: (data) => {
        this.servicios = data || [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando servicios';
      }
    });
  }

  aplicarFiltros() {
    const q = (this.filtroTexto || '').toLowerCase().trim();

    this.serviciosFiltrados = this.servicios.filter(s => {
      const coincideTipo = this.filtroTipo === 'todos'
        ? true
        : s.tipoServicio === this.filtroTipo;

      const nombre = (s.Elemento?.nombre || '').toLowerCase();
      const precio = String(s.Elemento?.precio ?? '').toLowerCase();
      const texto = `${nombre} ${precio}`.trim();

      const coincideTexto = q === '' ? true : texto.includes(q);

      return coincideTipo && coincideTexto;
    });
  }

  limpiarFiltros() {
    this.filtroTipo = 'todos';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  verDetalle(s: Servicio) {
    // Ajusta la ruta si la llamas distinto
    this.router.navigate(['/edit-servicios', s.idElemento]);
  }

  crearServicio() {
    // Ajusta la ruta si la llamas distinto
    this.router.navigate(['/form-servicios']);
  }

  eliminarServicio(s: Servicio) {
    const nombre = s.Elemento?.nombre || `ID ${s.idElemento}`;
    if (!confirm(`¿Seguro que quieres eliminar el servicio "${nombre}"?`)) return;

    this.servicioService.deleteServicio(s.idElemento).subscribe({
      next: () => this.cargarServicios(),
      error: (err) => alert(err?.error?.message || 'Error eliminando servicio')
    });
  }
    volver() {
    this.router.navigate(['/menu-catalogo']);  
  }

}
