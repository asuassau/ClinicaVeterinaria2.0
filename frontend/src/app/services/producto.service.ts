import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/** Coincide con tu ENUM en backend */
export type ProductoTipo = 'medicamento' | 'material' | 'alimentacion' | 'complementos';

export interface Elemento {
  idElemento: number;
  nombre: string;
  descripcion: string | null;
  precio: number; // viene como DECIMAL; en JS muchas veces llega string, pero lo tipamos como number
}

export interface Producto {
  /** OJO: en tu modelo Producto la PK es idElemento */
  idElemento: number;
  stock: number;
  stockMinimo: number;
  tipo: ProductoTipo;
  foto: string | null;

  /** include del controller: as "Elemento" */
  Elemento?: Elemento;
}

/**
 * Payload que espera el backend en POST /api/producto
 * (controller valida: nombre, precio, tipo, stock, stockMinimo)
 */
export interface CreateProductoDto {
  nombre: string;
  precio: number;
  tipo: ProductoTipo;
  stock: number;
  stockMinimo: number;

  descripcion?: string | null;
  foto?: string | null;
}

/**
 * Payload para PUT /api/producto/:id (idElemento)
 * (controller hace pickDefined, así que puedes mandar parciales)
 */
export interface UpdateProductoDto {
  nombre?: string;
  precio?: number;
  descripcion?: string | null;

  stock?: number;
  stockMinimo?: number;
  tipo?: ProductoTipo;
  foto?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private apiUrl = 'http://localhost:8080/api/producto';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** GET /api/producto */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, {
      headers: this.authService.authHeaders(),
    });
  }

  /** GET /api/producto/:id  (idElemento) */
  getProductoById(idElemento: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${idElemento}`, {
      headers: this.authService.authHeaders(),
    });
  }

  /** POST /api/producto */
  createProducto(payload: CreateProductoDto,file?:Blob): Observable<Producto> {

     const formData = new FormData();
    formData.append('nombre', payload.nombre);
    formData.append('precio', payload.precio.toString());
    formData.append('tipo', payload.tipo);
    formData.append('stock', payload.stock.toString());
    formData.append('stockMinimo', payload.stockMinimo.toString());
    if (payload.descripcion !== undefined && payload.descripcion !== null) {
      formData.append('descripcion', payload.descripcion);
    }
        if (file) {
  formData.append('file', file, 'producto.jpg');
}

    return this.http.post<Producto>(this.apiUrl, formData, {
      headers: this.authService.authHeaders(),
    });
  }

  /** PUT /api/producto/:id  (idElemento) */
updateProducto(idElemento: number, payload: UpdateProductoDto, file?: Blob): Observable<Producto> {
  const formData = new FormData();

  const removeImage = (payload as any).removeImage;
  if (removeImage !== undefined) {
    formData.append('removeImage', String(removeImage));
  }

  if (payload.nombre !== undefined) formData.append('nombre', payload.nombre);
  if (payload.precio !== undefined) formData.append('precio', payload.precio.toString());
  if (payload.tipo !== undefined) formData.append('tipo', payload.tipo);
  if (payload.stock !== undefined) formData.append('stock', payload.stock.toString());
  if (payload.stockMinimo !== undefined) formData.append('stockMinimo', payload.stockMinimo.toString());
  if (payload.descripcion !== undefined && payload.descripcion !== null) formData.append('descripcion', payload.descripcion);

  if (file) {
    formData.append('file', file, 'producto.jpg');
  }

  return this.http.put<Producto>(`${this.apiUrl}/${idElemento}`, formData, {
    headers: this.authService.authHeaders(),
  });
}

  /** DELETE /api/producto/:id  (idElemento) */
  deleteProducto(idElemento: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idElemento}`, {
      headers: this.authService.authHeaders(),
    });
  }
}
