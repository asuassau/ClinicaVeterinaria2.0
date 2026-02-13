import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductoService,
  Producto,
  UpdateProductoDto,
  ProductoTipo
} from '../../../services/producto.service';

@Component({
  selector: 'app-edit-productos',
  templateUrl: './edit-productos.page.html',
  styleUrls: ['./edit-productos.page.scss'],
  standalone: false,
})
export class EditProductosPage {
  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';

  editMode = false;

  // producto "completo" (incluye Elemento)
  producto: Producto | null = null;

  // combos
  tipos: ProductoTipo[] = ['medicamento', 'material', 'alimentacion', 'complementos'];

  // form para edición
  form: UpdateProductoDto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo: 'medicamento',
    stock: 0,
    stockMinimo: 0,
    foto: '',
  };

  private idElemento!: number;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.idElemento = Number(id);

    if (!this.idElemento) {
      this.errorMsg = 'ID de producto inválido.';
      return;
    }

    this.cargarProducto();
  }

  cargarProducto() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    this.productoService.getProductoById(this.idElemento).subscribe({
      next: (data) => {
        this.producto = data;
        this.precargarFormDesdeProducto(data);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando producto.';
      }
    });
  }

  activarEdicion() {
    if (!this.producto) return;
    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
    this.precargarFormDesdeProducto(this.producto);
  }

  cancelarEdicion() {
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';
    if (this.producto) this.precargarFormDesdeProducto(this.producto);
  }

  guardarCambios() {
    if (!this.producto) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    const payload: UpdateProductoDto = {
      // Elemento
      nombre: (this.form.nombre || '').trim() || undefined,
      descripcion: (this.form.descripcion || '').trim() || undefined,
      precio: this.form.precio !== null && this.form.precio !== undefined ? Number(this.form.precio) : undefined,

      // Producto
      tipo: this.form.tipo || undefined,
      stock: this.form.stock !== null && this.form.stock !== undefined ? Number(this.form.stock) : undefined,
      stockMinimo: this.form.stockMinimo !== null && this.form.stockMinimo !== undefined ? Number(this.form.stockMinimo) : undefined,
      foto: (this.form.foto || '').trim() || undefined,
    };

    // (opcional) limpia undefined/'' para que viaje lo mínimo
    Object.keys(payload).forEach((k) => {
      const key = k as keyof UpdateProductoDto;
      if (payload[key] === undefined || payload[key] === '') delete payload[key];
    });

    this.productoService.updateProducto(this.idElemento, payload).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Producto actualizado correctamente.';
        this.editMode = false;
        this.cargarProducto();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error guardando cambios.';
      }
    });
  }

  volver() {
    this.router.navigate(['/list-productos']);
  }

  private precargarFormDesdeProducto(p: Producto) {
    // Si tu API devuelve Elemento anidado como p.Elemento
    const el = (p as any).Elemento || (p as any).elemento || null;

    this.form = {
      nombre: el?.nombre ?? '',
      descripcion: el?.descripcion ?? '',
      precio: el?.precio ?? 0,

      tipo: p.tipo ?? 'medicamento',
      stock: p.stock ?? 0,
      stockMinimo: p.stockMinimo ?? 0,
      foto: p.foto ?? '',
    };
  }
}
