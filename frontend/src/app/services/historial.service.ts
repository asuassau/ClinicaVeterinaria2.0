import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type EstadoHistorial = 'Activo' | 'Inactivo';

export interface UsuarioMini {
  idUsuario: number;
  dni?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
}

export interface AnimalMini {
  idAnimal: number;
  nombre?: string;
  especie?: string;
  raza?: string;

  // según tu backend/associations podría venir:
  Dueno?: UsuarioMini;
  idUsuario_dueno?: number;
}

export interface Historial {
  idHistorial: number;
  fechaAlta: string; // DATEONLY -> "YYYY-MM-DD"
  estado: EstadoHistorial;
  idAnimal: number;

  // opcional si backend hace include
  Animal?: AnimalMini;

  // opcional si backend incluye líneas
  Lineas?: any[];
}

export interface CreateHistorialDto {
  fechaAlta: string; // YYYY-MM-DD
  estado: EstadoHistorial;
  idAnimal: number;
}

export interface UpdateHistorialDto {
  fechaAlta?: string;
  estado?: EstadoHistorial;
  // idAnimal normalmente no se toca, pero si lo permites:
  idAnimal?: number;
}

@Injectable({ providedIn: 'root' })
export class HistorialService {
  private baseUrl = 'http://localhost:8080/api/historial';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  /**
   * GET /api/historial
   * - ?include=1 (si lo implementas en backend para traer Animal/Dueño/Lineas)
   */
  getHistoriales(include = false): Observable<Historial[]> {
    const params = include ? new HttpParams().set('include', '1') : undefined;
    return this.http.get<Historial[]>(this.baseUrl, {
      params,
      headers: this.auth.authHeaders(),
    });
  }

  /**
   * GET /api/historial/:id
   * - ?include=1 (si lo implementas)
   */
  getHistorialById(idHistorial: number, include = false): Observable<Historial> {
    const params = include ? new HttpParams().set('include', '1') : undefined;
    return this.http.get<Historial>(`${this.baseUrl}/${idHistorial}`, {
      params,
      headers: this.auth.authHeaders(),
    });
  }

  /** POST /api/historial */
  createHistorial(dto: CreateHistorialDto): Observable<Historial> {
    return this.http.post<Historial>(this.baseUrl, dto, {
      headers: this.auth.authHeaders(),
    });
  }

  /** PUT /api/historial/:id */
  updateHistorial(idHistorial: number, dto: UpdateHistorialDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idHistorial}`, dto, {
      headers: this.auth.authHeaders(),
    });
  }

  /** DELETE /api/historial/:id  (tu backend debería borrar líneas asociadas) */
  deleteHistorial(idHistorial: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idHistorial}`, {
      headers: this.auth.authHeaders(),
    });
  }

  /**
   * OPCIONAL si lo implementas:
   * GET /api/historial/:id/lineas
   */
  getLineasDeHistorial(idHistorial: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${idHistorial}/lineas`, {
      headers: this.auth.authHeaders(),
    });
  }
}
