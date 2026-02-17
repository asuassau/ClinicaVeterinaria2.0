import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ProductoService,
  Producto,
  UpdateProductoDto,
  ProductoTipo
} from '../../../services/producto.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';

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
    private router: Router,
    private permisos: PermisosService
  ) {}

  get canVer(): boolean {
    return this.permisos.can('productos', 'ver');
  }

  get canEditar(): boolean {
    return this.permisos.can('productos', 'editar');
  }

  // ✅ Solo admin puede editar "campos sensibles" de producto
  get canEditarCamposBase(): boolean {
    return this.permisos.role() === 'administrador';
  }

  ionViewWillEnter() {
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }

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
    if (!this.canEditar) return;

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
    if (!this.canEditar) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    // ✅ Admin: puede enviar todo
    // ✅ No-admin (vet/recep): solo stock + foto
    let payload: UpdateProductoDto;

    if (this.canEditarCamposBase) {
      payload = {
        // Elemento
        nombre: (this.form.nombre || '').trim() || undefined,
        descripcion: (this.form.descripcion || '').trim() || undefined,
        precio:
          this.form.precio !== null && this.form.precio !== undefined
            ? Number(this.form.precio)
            : undefined,

        // Producto
        tipo: this.form.tipo || undefined,
        stock:
          this.form.stock !== null && this.form.stock !== undefined
            ? Number(this.form.stock)
            : undefined,
        stockMinimo:
          this.form.stockMinimo !== null && this.form.stockMinimo !== undefined
            ? Number(this.form.stockMinimo)
            : undefined,
        foto: (this.form.foto || '').trim() || undefined,
      };
    } else {
      payload = {
        stock:
          this.form.stock !== null && this.form.stock !== undefined
            ? Number(this.form.stock)
            : undefined,
        foto: (this.form.foto || '').trim() || undefined,
      };
    }

    // limpiar undefined/'' para que viaje lo mínimo
    Object.keys(payload).forEach((k) => {
      const key = k as keyof UpdateProductoDto;
      if ((payload as any)[key] === undefined || (payload as any)[key] === '') delete (payload as any)[key];
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
