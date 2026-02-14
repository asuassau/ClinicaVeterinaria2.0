import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LineaFacturaService, LineaFactura } from '../../../services/linea-factura.service';

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

  private idLineaFactura!: number;

  constructor(
    private lfService: LineaFacturaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.idLineaFactura = Number(id);

    if (!this.idLineaFactura) {
      this.errorMsg = 'ID de línea inválido.';
      return;
    }

    this.cargarLinea();
  }

  cargarLinea() {
    this.loading = true;
    this.errorMsg = '';

    // 👇 CLAVE: include=1 para traer Elemento y Creador
    this.lfService.getLineaById(this.idLineaFactura, true).subscribe({
      next: (data) => {
        this.linea = data;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando línea de factura.';
      }
    });
  }

  // ---------- Helpers UI ----------
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
    // YYYY-MM-DD
    return new Date(iso).toISOString().slice(0, 10);
  }

  horaSolo(): string {
    const iso = this.linea?.fechaCreacion;
    if (!iso) return '-';
    // HH:mm (en hora local del navegador)
    const d = new Date(iso);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  volver() {
    // Si vienes filtrando por factura, respeta el queryParam
    const idFactura = this.route.snapshot.queryParamMap.get('idFactura');
    if (idFactura) {
      this.router.navigate(['/list-lineas-facturas'], { queryParams: { idFactura } });
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
