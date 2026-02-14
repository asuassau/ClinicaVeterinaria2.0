import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type EstadoFactura = 'Creada' | 'Emitida' | 'Pagada' | 'cancelada';
export type FormaPago = 'efectivo' | 'tarjeta' | 'bizum' | 'transferencia';

export interface UsuarioMini {
  idUsuario: number;
  nombre?: string;
  apellidos?: string;
  email?: string;
}

export interface Factura {
  idFactura: number;
  fechaCreacion: string;
  FechaPago?: string | null;
  total: number;
  descPct?: number | null;
  impuestoPct?: number | null;
  estado: EstadoFactura;
  formaPago?: FormaPago | null;
  n_factura: string;
  idUsuario_pagador: number;
  idUsuario_emisor: number;

  Pagador?: UsuarioMini;
  Emisor?: UsuarioMini;
  Lineas?: any[];
}

export interface CreateFacturaDto {
  fechaCreacion: string;
  FechaPago?: string | null;
  descPct?: number | null;
  impuestoPct?: number | null;
  estado: EstadoFactura;
  formaPago?: FormaPago | null;
  n_factura: string;
  idUsuario_pagador: number;
  idUsuario_emisor: number;
}

export interface UpdateFacturaDto {
  FechaPago?: string | null;
  descPct?: number | null;
  impuestoPct?: number | null;
  estado?: EstadoFactura;
  formaPago?: FormaPago | null;
}

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private baseUrl = 'http://localhost:8080/api/factura';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getFacturas(include = false): Observable<Factura[]> {
    const params = include ? new HttpParams().set('include', '1') : undefined;
    return this.http.get<Factura[]>(this.baseUrl, {
      params,
      headers: this.auth.authHeaders()
    });
  }

  getFacturaById(idFactura: number, include = false): Observable<Factura> {
    const params = include ? new HttpParams().set('include', '1') : undefined;
    return this.http.get<Factura>(`${this.baseUrl}/${idFactura}`, {
      params,
      headers: this.auth.authHeaders()
    });
  }

  createFactura(dto: CreateFacturaDto): Observable<Factura> {
    return this.http.post<Factura>(this.baseUrl, dto, {
      headers: this.auth.authHeaders()
    });
  }

  updateFactura(idFactura: number, dto: UpdateFacturaDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idFactura}`, dto, {
      headers: this.auth.authHeaders()
    });
  }

  deleteFactura(idFactura: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idFactura}`, {
      headers: this.auth.authHeaders()
    });
  }

  // Si implementas endpoint: GET /api/factura/:id/lineas
  getLineasDeFactura(idFactura: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${idFactura}/lineas`, {
      headers: this.auth.authHeaders()
    });
  }
}
