import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import {
  LineaHistorialService,
  CreateLineaHistorialDto,
  TipoLineaHistorial
} from 'src/app/services/linea-historial.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


@Component({
  selector: 'app-form-lineas-historiales',
  templateUrl: './form-lineas-historiales.page.html',
  styleUrls: ['./form-lineas-historiales.page.scss'],
  standalone: false,
})
export class FormLineasHistorialesPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  idHistorial!: number;

  tipos: TipoLineaHistorial[] = ['diagnóstico', 'tratamiento', 'observación'];

  // autor (solo visual)
  autorLabel = '';

  form = {
    peso: null as number | null,
    tipo: 'observación' as TipoLineaHistorial,
    descripcion: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private lineaHistorialService: LineaHistorialService,
    private permisos: PermisosService

  ) {}

  get canNuevo(): boolean {
    return this.permisos.can('lineasHistorial', 'nuevo');
  }


  ionViewWillEnter() {

if (!this.canNuevo) {
  this.router.navigate(['/menu']);
  return;
}

    const id = this.route.snapshot.queryParamMap.get('idHistorial');
    this.idHistorial = Number(id);

    if (!this.idHistorial) {
      this.errorMsg = 'ID de historial inválido.';
      return;
    }

    this.cargarAutor();
  }

  private cargarAutor() {
    const u: any = this.auth.getUser();
    const idUsuario = Number(u?.idUsuario);

    if (!idUsuario) {
      this.errorMsg = 'No se pudo obtener el usuario logueado. Inicia sesión de nuevo.';
      return;
    }

    const dni = (u?.dni ?? u?.nif ?? u?.DNI ?? u?.NIF ?? '').toString().trim();
    const nombre = `${u?.nombre || ''} ${u?.apellidos || ''}`.trim();

    const left = dni ? dni : String(idUsuario);
    this.autorLabel = `${left} - ${nombre || '(sin nombre)'}`;
  }

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';

    const u: any = this.auth.getUser();
    const idUsuario = Number(u?.idUsuario);

    if (!idUsuario) {
      this.errorMsg = 'No se pudo obtener el usuario logueado. Inicia sesión de nuevo.';
      return;
    }

    if (!this.form.tipo) {
      this.errorMsg = 'Debes seleccionar un tipo.';
      return;
    }

    const descripcion = (this.form.descripcion || '').trim();
    if (!descripcion) {
      this.errorMsg = 'La descripción es obligatoria.';
      return;
    }

    // peso opcional, pero si viene, debe ser válido
    let peso: number | null = null;
    if (this.form.peso !== null && this.form.peso !== undefined && this.form.peso !== ('' as any)) {
      const n = Number(this.form.peso);
      if (!Number.isFinite(n) || n < 0) {
        this.errorMsg = 'El peso debe ser un número válido (>= 0).';
        return;
      }
      peso = Number(n.toFixed(2));
    }

    const dto: CreateLineaHistorialDto = {
      fechaCreacion: new Date().toISOString(),
      // fechaEdicion NO se envía al crear
      peso: peso ?? undefined,
      tipo: this.form.tipo,
      descripcion,
      idHistorial: this.idHistorial,
      idUsuario: idUsuario,
    };

    this.loading = true;

    this.lineaHistorialService.createLinea(dto).subscribe({
      next: () => {
        this.loading = false;
        this.okMsg = 'Línea de historial creada correctamente.';
        this.router.navigate(['/list-lineas-historiales'], {
          queryParams: { idHistorial: this.idHistorial }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error creando línea de historial.';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-lineas-historiales'], {
      queryParams: { idHistorial: this.idHistorial }
    });
  }
}
