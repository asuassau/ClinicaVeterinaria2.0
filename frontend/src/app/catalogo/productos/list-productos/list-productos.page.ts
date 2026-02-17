import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService, Producto, ProductoTipo } from '../../../services/producto.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';

type TipoFiltro = ProductoTipo | 'todos';

@Component({
  selector: 'app-list-productos',
  templateUrl: './list-productos.page.html',
  styleUrls: ['./list-productos.page.scss'],
  standalone: false,
})
export class ListProductosPage {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];

  filtroTipo: TipoFiltro = 'todos';
  filtroTexto = '';

  loading = false;
  errorMsg = '';

  // para el select
  tipos: ProductoTipo[] = ['medicamento', 'material', 'alimentacion', 'complementos'];

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private permisos: PermisosService
  ) {}

  get canVer(): boolean {
    return this.permisos.can('productos', 'ver');
  }

  get canNuevo(): boolean {
    return this.permisos.can('productos', 'nuevo');
  }

  get canEliminar(): boolean {
    return this.permisos.can('productos', 'eliminar');
  }

  ionViewWillEnter() {
    // ✅ protección de acceso a la vista (si alguien entra por URL)
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }

    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.errorMsg = '';

    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos = data || [];
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando productos';
      }
    });
  }

  aplicarFiltros() {
    const q = (this.filtroTexto || '').toLowerCase().trim();

    this.productosFiltrados = this.productos.filter(p => {
      const coincideTipo = this.filtroTipo === 'todos' ? true : p.tipo === this.filtroTipo;

      const nombre = (p.Elemento?.nombre || '').toLowerCase();
      const descripcion = (p.Elemento?.descripcion || '').toLowerCase();
      const precio = String(p.Elemento?.precio ?? '').toLowerCase();
      const id = String(p.idElemento ?? '').toLowerCase();
      const tipo = String(p.tipo ?? '').toLowerCase();
      const stock = String(p.stock ?? '').toLowerCase();
      const stockMin = String(p.stockMinimo ?? '').toLowerCase();

      const texto = `${nombre} ${descripcion} ${precio} ${id} ${tipo} ${stock} ${stockMin}`.trim();

      const coincideTexto = q === '' ? true : texto.includes(q);

      return coincideTipo && coincideTexto;
    });
  }

  limpiarFiltros() {
    this.filtroTipo = 'todos';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  stockBajo(p: Producto): boolean {
    const stock = Number(p.stock ?? 0);
    const min = Number(p.stockMinimo ?? 0);
    return stock < min;
  }

  eliminarProducto(p: Producto) {
    // ✅ doble-check (seguridad extra)
    if (!this.canEliminar) return;

    const nombre = p.Elemento?.nombre || `ID ${p.idElemento}`;
    if (!confirm(`¿Seguro que quieres eliminar el producto "${nombre}"?`)) return;

    this.productoService.deleteProducto(p.idElemento).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => {
        alert(err?.error?.message || 'Error eliminando producto');
      }
    });
  }

  verDetalle(p: Producto) {
    this.router.navigate(['/edit-productos', p.idElemento]);
  }

  crearProducto() {
    // ✅ doble-check (seguridad extra)
    if (!this.canNuevo) return;

    this.router.navigate(['/form-productos']);
  }

      volver() {
    this.router.navigate(['/menu-catalogo']);  
  }
}
