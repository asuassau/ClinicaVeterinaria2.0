import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import {
  LineaHistorialService,
  LineaHistorial,
  TipoLineaHistorial,
  UpdateLineaHistorialDto
} from 'src/app/services/linea-historial.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


@Component({
  selector: 'app-edit-lineas-historiales',
  templateUrl: './edit-lineas-historiales.page.html',
  styleUrls: ['./edit-lineas-historiales.page.scss'],
  standalone: false,
})
export class EditLineasHistorialesPage {
  loading = false;
  saving = false;

  errorMsg = '';
  okMsg = '';

  editMode = false;

  linea: LineaHistorial | null = null;
  private idLineaHistorial!: number;

  tipos: TipoLineaHistorial[] = ['diagnóstico', 'tratamiento', 'observación'];

  // Form de edición
  form = {
    peso: null as number | null,
    tipo: 'observación' as TipoLineaHistorial,
    descripcion: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private lineaService: LineaHistorialService,
    private permisos: PermisosService
  ) {}

  get canEditar(): boolean {
  return this.permisos.can('lineasHistorial', 'editar');
}

get canVer(): boolean {
  return this.permisos.can('lineasHistorial', 'ver');
} 

  ionViewWillEnter() {

if (!this.canVer) {
  this.router.navigate(['/menu']);
  return;
}

    const id = this.route.snapshot.paramMap.get('id');
    this.idLineaHistorial = Number(id);

    if (!this.idLineaHistorial) {
      this.errorMsg = 'ID de línea inválido.';
      return;
    }

    this.cargarLinea();
  }

  cargarLinea() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    // include=1 para traer Autor si backend lo soporta
    this.lineaService.getLineaById(this.idLineaHistorial, true).subscribe({
      next: (data) => {
        this.linea = data;

        // preparar form por si el usuario entra a editar
        this.form.peso = (data.peso as any) ?? null;
        this.form.tipo = data.tipo;
        this.form.descripcion = data.descripcion ?? '';

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando línea de historial.';
      }
    });
  }

  activarEdicion() {
    if (!this.linea) return;
    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
  }

  cancelarEdicion() {
    // revertir form a valores actuales
    if (this.linea) {
      this.form.peso = (this.linea.peso as any) ?? null;
      this.form.tipo = this.linea.tipo;
      this.form.descripcion = this.linea.descripcion ?? '';
    }
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';
  }

  guardarCambios() {
    this.errorMsg = '';
    this.okMsg = '';

    if (!this.linea) return;

    const user: any = this.auth.getUser();
    const idUsuario = Number(user?.idUsuario);
    if (!idUsuario) {
      this.errorMsg = 'No se pudo obtener el usuario logueado. Inicia sesión de nuevo.';
      return;
    }

    const descripcion = (this.form.descripcion || '').trim();
    if (!descripcion) {
      this.errorMsg = 'La descripción es obligatoria.';
      return;
    }

    // peso opcional; si viene, validar
    let peso: number | null = null;
    if (this.form.peso !== null && this.form.peso !== undefined && this.form.peso !== ('' as any)) {
      const n = Number(this.form.peso);
      if (!Number.isFinite(n) || n < 0) {
        this.errorMsg = 'El peso debe ser un número válido (>= 0).';
        return;
      }
      peso = Number(n.toFixed(2));
    }

    const dto: UpdateLineaHistorialDto = {
      // ✅ fechaEdicion auto al editar
      fechaEdicion: new Date().toISOString(),

      // ✅ el autor pasa a ser el usuario que modifica
      idUsuario: idUsuario,

      // campos editables
      peso: peso ?? null,
      tipo: this.form.tipo,
      descripcion: descripcion,
    };

    this.saving = true;

    this.lineaService.updateLinea(this.idLineaHistorial, dto).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Línea de historial actualizada correctamente.';
        this.editMode = false;
        this.cargarLinea();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error actualizando línea de historial.';
      }
    });
  }

  // ======== Helpers UI ========

  autorLabelFrom(obj: any): string {
    if (!obj) return '-';
    const dni = (obj.dni ?? obj.nif ?? obj.DNI ?? obj.NIF ?? '').toString().trim();
    const nombre = `${obj.nombre || ''} ${obj.apellidos || ''}`.trim();
    const left = dni ? dni : String(obj.idUsuario ?? '');
    return `${left} - ${nombre || '(sin nombre)'}`.trim();
  }

  autorActualLabel(): string {
    // Autor guardado en la línea (si viene include)
    const a = (this.linea as any)?.Autor;
    if (a) return this.autorLabelFrom(a);

    // fallback: idUsuario numérico
    const id = (this.linea as any)?.idUsuario;
    return id ? `${id} - (sin datos)` : '-';
  }

  autorLogueadoLabel(): string {
    const u: any = this.auth.getUser();
    if (!u) return '-';
    return this.autorLabelFrom(u);
  }

  fechaSolo(iso?: string | null): string {
    if (!iso) return '-';
    return new Date(iso).toISOString().slice(0, 10);
  }

  horaSolo(iso?: string | null): string {
    if (!iso) return '-';
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  volver() {
    const idHistorial = this.route.snapshot.queryParamMap.get('idHistorial');
    if (idHistorial) {
      this.router.navigate(['/list-lineas-historiales'], { queryParams: { idHistorial } });
      return;
    }
    this.router.navigate(['/list-lineas-historiales']);
  }
}
