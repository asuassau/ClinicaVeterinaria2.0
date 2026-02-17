import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { LineaFacturaService, LineaFactura } from '../../../services/linea-factura.service';
import { FacturaService, Factura } from '../../../services/factura.service';
import { PermisosService } from 'src/app/seguridad/permisos.service';

@Component({
  selector: 'app-edit-lineas-facturas',
  templateUrl: './edit-lineas-facturas.page.html',
  styleUrls: ['./edit-lineas-facturas.page.scss'],
  standalone: false,
})
export class EditLineasFacturasPage {
  loading = false;
  errorMsg = '';

  linea: LineaFactura | null = null;
  factura: Factura | null = null;

  private idLineaFactura!: number;

  constructor(
    private lfService: LineaFacturaService,
    private facturaService: FacturaService,
    private route: ActivatedRoute,
    private router: Router,
    private permisos: PermisosService
  ) {}

saving = false;
okMsg = '';
editMode = false;

form: {
  cantidad: number;
  precioUnitario: number;
  descuento: number;
} = {
  cantidad: 1,
  precioUnitario: 0,
  descuento: 0,
};

  private get ctxFactura() {
    return { estadoFactura: this.factura?.estado };
  }

  get canVer(): boolean {
    return this.permisos.can('lineasFactura', 'ver', this.ctxFactura);
  }

  get canEditar(): boolean {
    return this.permisos.can('lineasFactura', 'editar', this.ctxFactura);
  }

  ionViewWillEnter() {
    // Bloqueo general (cliente no debe entrar nunca)
    if (!this.permisos.can('lineasFactura', 'ver')) {
      this.router.navigate(['/menu']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.idLineaFactura = Number(id);

    if (!this.idLineaFactura) {
      this.errorMsg = 'ID de línea inválido.';
      return;
    }

    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.errorMsg = '';

    // 1) Traer línea (incluye Elemento y Creador)
    this.lfService.getLineaById(this.idLineaFactura, true).subscribe({
      next: (linea) => {
        this.linea = linea;

        const idFactura = Number(linea?.idFactura);
        if (!idFactura) {
          this.loading = false;
          return;
        }

        // 2) Traer factura para disponer de ctx.estadoFactura
        this.facturaService.getFacturaById(idFactura, false).subscribe({
          next: (f) => {
            this.factura = f;
            this.loading = false;

            // Revalidación opcional con ctx (si algún día cambias reglas por estado)
            if (!this.canVer) {
              this.router.navigate(['/menu']);
              return;
            }
          },
          error: () => {
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando línea de factura.';
      }
    });
  }

  // ---------- Helpers UI ----------

private precargarForm() {
  if (!this.linea) return;
  this.form = {
    cantidad: Number(this.linea.cantidad ?? 1),
    precioUnitario: Number(this.linea.precioUnitario ?? 0),
    descuento: Number(this.linea.descuento ?? 0),
  };
}

  elementoNombre(): string {
    const el = (this.linea as any)?.Elemento;
    return el?.nombre || '-';
  }

  creadorNombre(): string {
    const c = (this.linea as any)?.Creador;
    if (!c) return '-';
    const nom = (c.nombre || '').trim();
    const ape = (c.apellidos || '').trim();
    return `${nom} ${ape}`.trim() || '-';
  }

  fechaSolo(): string {
    const iso = this.linea?.fechaCreacion;
    if (!iso) return '-';
    return new Date(iso).toISOString().slice(0, 10);
  }

  horaSolo(): string {
    const iso = this.linea?.fechaCreacion;
    if (!iso) return '-';
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  volver() {
    const idFacturaQP = this.route.snapshot.queryParamMap.get('idFactura');
    if (idFacturaQP) {
      this.router.navigate(['/list-lineas-facturas'], { queryParams: { idFactura: idFacturaQP } });
      return;
    }

    const fallbackFactura = this.linea?.idFactura;
    if (fallbackFactura) {
      this.router.navigate(['/list-lineas-facturas'], { queryParams: { idFactura: fallbackFactura } });
      return;
    }

    this.router.navigate(['/list-lineas-facturas']);
  }

  formatMoney(v: any): string {
    const n = Number(v);
    if (!Number.isFinite(n)) return '-';
    return `${n.toFixed(2)} €`;
  }


}
