import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface LineaFactura {
  idLineaFactura: number;
  fechaCreacion: string;
  cantidad: number;
  descuento?: number | null;
  importe: number;
  precioUnitario: number;
  idFactura: number;
  idElemento: number;
  idUsuario_creador: number;

  Elemento?: any;
  Factura?: any;
  Creador?: any;
}

export interface CreateLineaFacturaDto {
  fechaCreacion: string;
  cantidad: number;
  descuento?: number | null;
  importe?: number; // si backend lo calcula, puedes quitarlo
  precioUnitario: number;
  idFactura: number;
  idElemento: number;
  idUsuario_creador: number;
}

export interface UpdateLineaFacturaDto {
  cantidad?: number;
  descuento?: number | null;
  precioUnitario?: number;
  // idElemento normalmente no se cambia, pero si quieres permitirlo:
  idElemento?: number;
}

@Injectable({ providedIn: 'root' })
export class LineaFacturaService {
  private baseUrl = 'http://localhost:8080/api/lineaFactura';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  getLineas(include = false): Observable<LineaFactura[]> {
    const params = include ? new HttpParams().set('include', '1') : undefined;
    return this.http.get<LineaFactura[]>(this.baseUrl, {
      params,
      headers: this.auth.authHeaders()
    });
  }

// Filtro por factura: GET /api/lineaFactura?facturaId=XX
getLineasByFactura(idFactura: number, include = true) {
  let params = new HttpParams().set('facturaId', String(idFactura));
  if (include) params = params.set('include', '1');

  return this.http.get<LineaFactura[]>(this.baseUrl, {
    params,
    headers: this.auth.authHeaders()
  });
}



getLineaById(id: number, include = true): Observable<LineaFactura> {
  const params = include ? new HttpParams().set('include', '1') : undefined;

  return this.http.get<LineaFactura>(`${this.baseUrl}/${id}`, {
    params,
    headers: this.auth.authHeaders()
  });
}

  createLinea(dto: CreateLineaFacturaDto): Observable<LineaFactura> {
    return this.http.post<LineaFactura>(this.baseUrl, dto, {
      headers: this.auth.authHeaders()
    });
  }

  updateLinea(id: number, dto: UpdateLineaFacturaDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, dto, {
      headers: this.auth.authHeaders()
    });
  }

  deleteLinea(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: this.auth.authHeaders()
    });
  }
}
