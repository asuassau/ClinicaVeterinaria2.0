import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LineaFacturaService, LineaFactura } from '../../../services/linea-factura.service';
import { FacturaService, Factura } from '../../../services/factura.service';

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
  factura: Factura | null = null; // opcional para mostrar total/estado

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lineaService: LineaFacturaService,
    private facturaService: FacturaService
  ) {}

  ionViewWillEnter() {
    // ✅ viene por queryParams: /list-lineas-facturas?idFactura=123
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

    // líneas (incluye Elemento)
    this.lineaService.getLineasByFactura(this.idFactura, true).subscribe({
      next: (data) => {
        this.lineas = data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando líneas de factura.';
      }
    });

    // opcional: traer factura para mostrar total calculado
    this.facturaService.getFacturaById(this.idFactura, false).subscribe({
      next: (f) => (this.factura = f),
      error: () => {}
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
    const nombre = this.nombreElemento(l);
    if (!confirm(`¿Eliminar la línea "${nombre}"?`)) return;

    this.lineaService.deleteLinea(l.idLineaFactura).subscribe({
      next: () => this.cargar(),
      error: (err) => alert(err?.error?.message || 'Error eliminando línea.')
    });
  }

  verDetalle(l: LineaFactura) {
    this.router.navigate(['/edit-lineas-facturas', l.idLineaFactura]);
  }

  crearLinea() {
    this.router.navigate(['/form-lineas-facturas'], {
      queryParams: { idFactura: this.idFactura }
    });
  }

  volverAFacturas() {
    this.router.navigate(['/list-facturas']);
  }
}
