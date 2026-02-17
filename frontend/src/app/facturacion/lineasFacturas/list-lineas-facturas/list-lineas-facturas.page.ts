import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { LineaFacturaService, LineaFactura } from '../../../services/linea-factura.service';
import { FacturaService, Factura } from '../../../services/factura.service';
import { PermisosService } from 'src/app/seguridad/permisos.service';

@Component({
  selector: 'app-list-lineas-facturas',
  templateUrl: './list-lineas-facturas.page.html',
  styleUrls: ['./list-lineas-facturas.page.scss'],
  standalone: false,
})
export class ListLineasFacturasPage {
  loading = false;
  errorMsg = '';

  idFactura!: number;

  lineas: LineaFactura[] = [];
  factura: Factura | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lineaService: LineaFacturaService,
    private facturaService: FacturaService,
    private permisos: PermisosService
  ) {}

  // ---- ctx dinámico (estado de la factura) ----
  private get ctxFactura() {
    return { estadoFactura: this.factura?.estado };
  }

  get canVer(): boolean {
    return this.permisos.can('lineasFactura', 'ver', this.ctxFactura);
  }

  get canNuevoLinea(): boolean {
    return this.permisos.can('lineasFactura', 'nuevo', this.ctxFactura);
  }

  get canEliminarLinea(): boolean {
    return this.permisos.can('lineasFactura', 'eliminar', this.ctxFactura);
  }

  get facturaCerrada(): boolean {
    return String(this.factura?.estado ?? '').trim().toLowerCase() === 'pagada';
  }

  ionViewWillEnter() {
    // Cliente NO debe entrar aquí (según permisos.ts)
    if (!this.permisos.can('lineasFactura', 'ver')) {
      this.router.navigate(['/menu']);
      return;
    }

    const id = this.route.snapshot.queryParamMap.get('idFactura');
    this.idFactura = Number(id);

    if (!this.idFactura) {
      this.errorMsg = 'ID de factura inválido.';
      return;
    }

    this.cargar();
  }

  cargar() {
    this.loading = true;
    this.errorMsg = '';

    forkJoin({
      factura: this.facturaService.getFacturaById(this.idFactura, false),
      lineas: this.lineaService.getLineasByFactura(this.idFactura, true),
    }).subscribe({
      next: ({ factura, lineas }) => {
        this.factura = factura;
        this.lineas = lineas || [];
        this.loading = false;

        // si por lo que sea no tiene permiso real al final (ej: cambios de rol), fuera
        if (!this.canVer) {
          this.router.navigate(['/menu']);
          return;
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message || 'Error cargando factura o líneas de factura.';
      }
    });
  }

  nombreElemento(l: LineaFactura): string {
    return (l as any)?.Elemento?.nombre || `Elemento ${l.idElemento}`;
  }

  precioElemento(l: LineaFactura): number {
    const p = (l as any)?.Elemento?.precio;
    return p !== undefined && p !== null ? Number(p) : Number(l.precioUnitario ?? 0);
  }

  importeLinea(l: LineaFactura): number {
    return Number(l.importe ?? 0);
  }

  eliminarLinea(l: LineaFactura) {
    if (!this.canEliminarLinea) {
      alert('No tienes permisos para eliminar líneas de factura.');
      return;
    }

    const nombre = this.nombreElemento(l);
    if (!confirm(`¿Eliminar la línea "${nombre}"?`)) return;

    this.lineaService.deleteLinea(l.idLineaFactura).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err?.error?.message || 'Error eliminando línea.')
    });
  }

  verDetalle(l: LineaFactura) {
    this.router.navigate(['/edit-lineas-facturas', l.idLineaFactura], {
      queryParams: { idFactura: this.idFactura }
    });
  }

  crearLinea() {
    if (!this.canNuevoLinea) {
      alert('No tienes permisos para crear líneas de factura.');
      return;
    }

    this.router.navigate(['/form-lineas-facturas'], {
      queryParams: { idFactura: this.idFactura }
    });
  }

  volverAFacturas() {
    this.router.navigate(['/list-facturas']);
  }
}
