import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

/** Coincide con tu ENUM del backend */
export type TipoServicio = 'CONSULTA' | 'PRUEBA' | 'CIRUGIA' | 'VACUNACION';

export interface Elemento {
  idElemento: number;
  nombre: string;
  descripcion: string | null;
  precio: number; // DECIMAL(10,2) suele llegar como string a veces; lo tipamos como number
}

export interface Servicio {
  /** PK del servicio en tu modelo = idElemento */
  idElemento: number;
  tipoServicio: TipoServicio;

  /** include del controller: as "Elemento" */
  Elemento?: Elemento;
}

/**
 * Payload que espera el backend en POST /api/servicio
 * (controller valida: nombre, precio, tipoServicio)
 */
export interface CreateServicioDto {
  nombre: string;
  precio: number;
  tipoServicio: TipoServicio;

  descripcion?: string | null;
}

/**
 * Payload para PUT /api/servicio/:id (idElemento)
 * (controller hace pickDefined, así que puedes mandar parciales)
 */
export interface UpdateServicioDto {
  nombre?: string;
  precio?: number;
  descripcion?: string | null;

  tipoServicio?: TipoServicio;
}

@Injectable({ providedIn: 'root' })
export class ServicioService {
  private apiUrl = 'http://localhost:8080/api/servicio';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** GET /api/servicio */
  getServicios(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl, {
      headers: this.authService.authHeaders(),
    });
  }

  /** GET /api/servicio/:id  (idElemento) */
  getServicioById(idElemento: number): Observable<Servicio> {
    return this.http.get<Servicio>(`${this.apiUrl}/${idElemento}`, {
      headers: this.authService.authHeaders(),
    });
  }

  /** POST /api/servicio */
  createServicio(payload: CreateServicioDto): Observable<Servicio> {
    return this.http.post<Servicio>(this.apiUrl, payload, {
      headers: this.authService.authHeaders(),
    });
  }

  /** PUT /api/servicio/:id  (idElemento) */
  updateServicio(idElemento: number, payload: UpdateServicioDto): Observable<Servicio> {
    return this.http.put<Servicio>(`${this.apiUrl}/${idElemento}`, payload, {
      headers: this.authService.authHeaders(),
    });
  }

  /** DELETE /api/servicio/:id  (idElemento) */
  deleteServicio(idElemento: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idElemento}`, {
      headers: this.authService.authHeaders(),
    });
  }
}
