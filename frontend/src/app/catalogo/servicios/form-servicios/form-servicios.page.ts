import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  ServicioService,
  CreateServicioDto,
  TipoServicio
} from '../../../services/servicio.service';

@Component({
  selector: 'app-form-servicios',
  templateUrl: './form-servicios.page.html',
  styleUrls: ['./form-servicios.page.scss'],
  standalone: false,
})
export class FormServiciosPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  tiposServicio: TipoServicio[] = ['CONSULTA', 'PRUEBA', 'CIRUGIA', 'VACUNACION'];

  form: CreateServicioDto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    tipoServicio: 'CONSULTA'
  };

  constructor(
    private servicioService: ServicioService,
    private router: Router
  ) {}

  guardar() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    const payload: CreateServicioDto = {
      nombre: (this.form.nombre || '').trim(),
      descripcion: (this.form.descripcion || '').trim() || undefined,
      precio: Number(this.form.precio),
      tipoServicio: this.form.tipoServicio
    };

    this.servicioService.createServicio(payload).subscribe({
      next: () => {
        this.loading = false;
        this.okMsg = 'Servicio creado correctamente.';
        // vuelve al listado (ajusta la ruta si la llamas distinto)
        this.router.navigate(['/list-servicios']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error creando servicio';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-servicios']);
  }
}
