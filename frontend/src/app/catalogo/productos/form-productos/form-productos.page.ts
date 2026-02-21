import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService, CreateProductoDto, ProductoTipo } from '../../../services/producto.service';
import { PhotoService } from '../../../services/photo.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';

@Component({
  selector: 'app-form-productos',
  templateUrl: './form-productos.page.html',
  styleUrls: ['./form-productos.page.scss'],
  standalone: false,
})
export class FormProductosPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  tipos: ProductoTipo[] = ['medicamento', 'material', 'alimentacion', 'complementos'];

  form: CreateProductoDto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    tipo: 'medicamento',
    stock: 0,
    stockMinimo: 0,
    foto: ''
  };

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private permisos: PermisosService,
    public photoService: PhotoService
  ) {}

  capturedPhoto: string = "";
  originalPhoto: string = "";

  removeImage = false;


  get canNuevo(): boolean {
    return this.permisos.can('productos', 'nuevo');
  }

  ionViewWillEnter() {
    if (!this.canNuevo) {
      this.router.navigate(['/menu']);
      return; // ✅ importante
    }
  }

  async guardar() {
      // ✅ doble blindaje (si alguien fuerza la acción)
    if (!this.canNuevo) {
      this.errorMsg = 'No tienes permisos para crear productos.';
      return;
    }

    this.errorMsg = '';
    this.okMsg = '';
    this.loading = true;

     let blob: Blob | null = null;

if (this.capturedPhoto && this.capturedPhoto !== this.originalPhoto) {
  try {
    const response = await fetch(this.capturedPhoto);
    blob = await response.blob();
  } catch (e) {
    blob = null;
  }
}

    // Normaliza campos numéricos (por si llegan como string desde ion-input)
    const payload: CreateProductoDto = {
      ...this.form,
      precio: Number(this.form.precio),
      stock: Number(this.form.stock),
      stockMinimo: Number(this.form.stockMinimo),
      // si foto viene vacía, mándala como undefined para no ensuciar
      //foto: (this.form.foto || '').trim() ? (this.form.foto || '').trim() : undefined,
      descripcion: (this.form.descripcion || '').trim() ? (this.form.descripcion || '').trim() : undefined,
    };

    this.productoService.createProducto(payload, blob ?? undefined).subscribe({
      next: () => {
        this.loading = false;
        this.okMsg = 'Producto creado correctamente';
        setTimeout(() => this.router.navigate(['/list-productos']), 600);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error creando producto (revisa backend/token).';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-productos']);
  }
    //metodos para las gestión de la foto 
  takePhoto() {

    this.photoService.takePhoto().then(data => {
      this.capturedPhoto = data.webPath ? data.webPath : "";
      this.removeImage = false;
    });
  }

  pickImage() {

    this.photoService.pickImage().then(data => {
      this.capturedPhoto = data.webPath;
      this.removeImage = false;
    });
  }

  discardImage() {

    this.capturedPhoto = "";
    this.removeImage = true;
  }
  
}
