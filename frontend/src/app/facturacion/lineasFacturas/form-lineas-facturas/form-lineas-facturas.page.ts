import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from 'src/app/services/auth.service';
import { ProductoService, Producto } from 'src/app/services/producto.service';
import { ServicioService, Servicio } from 'src/app/services/servicio.service';
import {
  LineaFacturaService,
  CreateLineaFacturaDto
} from 'src/app/services/linea-factura.service';

interface ElementoMini {
  idElemento: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
}

@Component({
  selector: 'app-form-lineas-facturas',
  templateUrl: './form-lineas-facturas.page.html',
  styleUrls: ['./form-lineas-facturas.page.scss'],
  standalone: false,
})
export class FormLineasFacturasPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  idFactura!: number;

  elementos: ElementoMini[] = [];
  elementoSeleccionado: ElementoMini | null = null;

  form = {
    idElemento: null as number | null,
    cantidad: 1,
    descuentoPct: 0, // % (solo UI)
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private productoService: ProductoService,
    private servicioService: ServicioService,
    private lineaFacturaService: LineaFacturaService
  ) {}

  ionViewWillEnter() {
    const id = this.route.snapshot.queryParamMap.get('idFactura');
    this.idFactura = Number(id);

    if (!this.idFactura) {
      this.errorMsg = 'ID de factura inválido.';
      return;
    }

    this.cargarElementos();
  }

  cargarElementos() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    forkJoin({
      productos: this.productoService.getProductos(),
      servicios: this.servicioService.getServicios(),
    }).subscribe({
      next: ({ productos, servicios }) => {
        const elems: ElementoMini[] = [];

        (productos || []).forEach((p: Producto) => {
          const el: any = (p as any).Elemento;
          if (el?.idElemento) {
            elems.push({
              idElemento: Number(el.idElemento),
              nombre: String(el.nombre ?? ''),
              descripcion: el.descripcion ?? null,
              precio: Number(el.precio ?? 0),
            });
          }
        });

        (servicios || []).forEach((s: Servicio) => {
          const el: any = (s as any).Elemento;
          if (el?.idElemento) {
            elems.push({
              idElemento: Number(el.idElemento),
              nombre: String(el.nombre ?? ''),
              descripcion: el.descripcion ?? null,
              precio: Number(el.precio ?? 0),
            });
          }
        });

        // deduplicar por idElemento
        const map = new Map<number, ElementoMini>();
        elems.forEach(e => {
          if (!map.has(e.idElemento)) map.set(e.idElemento, e);
        });

        this.elementos = Array.from(map.values())
          .sort((a, b) => a.idElemento - b.idElemento);

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando elementos (productos + servicios).';
      }
    });
  }

  elementoLabel(e: ElementoMini) {
    return `${e.idElemento} - ${e.nombre} (${Number(e.precio ?? 0).toFixed(2)}€)`;
  }

  onElementoChange() {
    const id = this.form.idElemento;
    this.elementoSeleccionado = this.elementos.find(e => e.idElemento === id) || null;
  }

  get precioUnitario(): number {
    return Number(this.elementoSeleccionado?.precio ?? 0);
  }

  get subtotal(): number {
    const c = Number(this.form.cantidad ?? 0);
    return Number((this.precioUnitario * c).toFixed(2));
  }

  // backend espera descuento como IMPORTE a restar
  get descuentoImporte(): number {
    const pct = Number(this.form.descuentoPct ?? 0);
    const d = this.subtotal * (pct / 100);
    return Number(Math.max(0, d).toFixed(2));
  }

  get importeFinal(): number {
    const imp = this.subtotal - this.descuentoImporte;
    return Number(Math.max(0, imp).toFixed(2));
  }

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';

    const user = this.auth.getUser();
    const idUsuario = Number(user?.idUsuario);

    if (!idUsuario) {
      this.errorMsg = 'No se pudo obtener el usuario logueado. Inicia sesión de nuevo.';
      return;
    }

    if (!this.form.idElemento) {
      this.errorMsg = 'Debes seleccionar un elemento.';
      return;
    }

    const cantidad = Number(this.form.cantidad ?? 0);
    if (!Number.isFinite(cantidad) || cantidad <= 0) {
      this.errorMsg = 'La cantidad debe ser mayor que 0.';
      return;
    }

    this.loading = true;

    const dto: CreateLineaFacturaDto = {
      fechaCreacion: new Date().toISOString(),
      cantidad,
      descuento: this.descuentoImporte,     // ✅ importe de descuento
      precioUnitario: this.precioUnitario, // ✅ precio del elemento
      idFactura: this.idFactura,
      idElemento: this.form.idElemento,
      idUsuario_creador: idUsuario,
    };

    this.lineaFacturaService.createLinea(dto).subscribe({
      next: () => {
        this.loading = false;
        this.okMsg = 'Línea de factura creada correctamente.';
        this.router.navigate(['/list-lineas-facturas'], {
          queryParams: { idFactura: this.idFactura }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error creando línea de factura.';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-lineas-facturas'], {
      queryParams: { idFactura: this.idFactura }
    });
  }
}
