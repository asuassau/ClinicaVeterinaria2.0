import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ServicioService,
  Servicio,
  UpdateServicioDto,
  TipoServicio
} from '../../../services/servicio.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


@Component({
  selector: 'app-edit-servicios',
  templateUrl: './edit-servicios.page.html',
  styleUrls: ['./edit-servicios.page.scss'],
  standalone: false,
})
export class EditServiciosPage {
  loading = false;
  saving = false;

  errorMsg = '';
  okMsg = '';

  editMode = false;

  servicio: Servicio | null = null;

  tiposServicio: TipoServicio[] = ['CONSULTA', 'PRUEBA', 'CIRUGIA', 'VACUNACION'];

  form: UpdateServicioDto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    tipoServicio: 'CONSULTA',
  };

  private idElemento!: number;

  constructor(
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    private router: Router,
    private permisos: PermisosService

  ) {}

  get canVer(): boolean {
  return this.permisos.can('servicios', 'ver');
}


get canEditar(): boolean {
  return this.permisos.can('servicios', 'editar');
}


  ionViewWillEnter() {

if (!this.canVer) {
  this.router.navigate(['/menu']);
  return;
} 

    const id = this.route.snapshot.paramMap.get('id');
    this.idElemento = Number(id);

    if (!this.idElemento) {
      this.errorMsg = 'ID de servicio inválido.';
      return;
    }

    this.cargarServicio();
  }

  cargarServicio() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    this.servicioService.getServicioById(this.idElemento).subscribe({
      next: (data) => {
        this.servicio = data;
        this.precargarFormDesdeServicio(data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando servicio.';
      }
    });
  }

  activarEdicion() {
    if (!this.servicio) return;
    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
    this.precargarFormDesdeServicio(this.servicio);
  }

  cancelarEdicion() {
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';
    if (this.servicio) this.precargarFormDesdeServicio(this.servicio);
  }

  guardarCambios() {
    if (!this.servicio) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    const payload: UpdateServicioDto = {
      // Elemento
      nombre: (this.form.nombre || '').trim() || undefined,
      descripcion: (this.form.descripcion || '').trim() || undefined,
      precio:
        this.form.precio !== null && this.form.precio !== undefined
          ? Number(this.form.precio)
          : undefined,

      // Servicio
      tipoServicio: this.form.tipoServicio || undefined,
    };

    // limpia undefined / '' para enviar solo lo necesario
    Object.keys(payload).forEach((k) => {
      const key = k as keyof UpdateServicioDto;
      if (payload[key] === undefined || payload[key] === '') delete payload[key];
    });

    this.servicioService.updateServicio(this.idElemento, payload).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Servicio actualizado correctamente.';
        this.editMode = false;
        this.cargarServicio();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error guardando cambios.';
      }
    });
  }

  volver() {
    this.router.navigate(['/list-servicios']);
  }

  private precargarFormDesdeServicio(s: Servicio) {
    const el = (s as any).Elemento || (s as any).elemento || null;

    this.form = {
      nombre: el?.nombre ?? '',
      descripcion: el?.descripcion ?? '',
      precio: el?.precio ?? 0,
      tipoServicio: s.tipoServicio ?? 'CONSULTA',
    };
  }
}
