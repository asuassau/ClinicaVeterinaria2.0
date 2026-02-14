import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type TipoLineaHistorial = 'diagnóstico' | 'tratamiento' | 'observación';

export interface UsuarioMini {
  idUsuario: number;
  dni?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
}

export interface LineaHistorial {
  idLineaHistorial: number;
  fechaCreacion: string;  // ISO
  fechaEdicion?: string | null;
  peso?: number | null;
  tipo: TipoLineaHistorial;
  descripcion: string;

  idHistorial: number;
  idUsuario: number;

  // opcional si backend hace include
  Historial?: any;
  Autor?: UsuarioMini;
}

export interface CreateLineaHistorialDto {
  fechaCreacion: string;  // ISO
  // fechaEdicion no se pasa al crear
  peso?: number | null;
  tipo: TipoLineaHistorial;
  descripcion: string;
  idHistorial: number;
  idUsuario: number;
}

export interface UpdateLineaHistorialDto {
  // suele actualizarse en backend al editar:
  fechaEdicion?: string | null;
  peso?: number | null;
  tipo?: TipoLineaHistorial;
  descripcion?: string;

  // normalmente NO se cambia, pero si quieres permitirlo:
  idHistorial?: number;
  idUsuario?: number;
}

@Injectable({ providedIn: 'root' })
export class LineaHistorialService {
  private baseUrl = 'http://localhost:8080/api/lineaHistorial';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  /**
   * GET /api/lineaHistorial
   * - ?include=1 (si lo implementas para traer Autor/Historial)
   * - ?historialId=123 (si lo implementas para filtrar)
   */
  getLineas(include = false, historialId?: number): Observable<LineaHistorial[]> {
    let params = new HttpParams();
    if (include) params = params.set('include', '1');
    if (historialId) params = params.set('historialId', String(historialId));

    return this.http.get<LineaHistorial[]>(this.baseUrl, {
      params: (include || historialId) ? params : undefined,
      headers: this.auth.authHeaders(),
    });
  }

  /** Helper: filtrar por historial */
  getLineasByHistorial(idHistorial: number, include = false): Observable<LineaHistorial[]> {
    return this.getLineas(include, idHistorial);
  }

  /**
   * GET /api/lineaHistorial/:id
   * - ?include=1 (si lo implementas)
   */
  getLineaById(idLinea: number, include = false): Observable<LineaHistorial> {
    const params = include ? new HttpParams().set('include', '1') : undefined;

    return this.http.get<LineaHistorial>(`${this.baseUrl}/${idLinea}`, {
      params,
      headers: this.auth.authHeaders(),
    });
  }

  /** POST /api/lineaHistorial */
  createLinea(dto: CreateLineaHistorialDto): Observable<LineaHistorial> {
    return this.http.post<LineaHistorial>(this.baseUrl, dto, {
      headers: this.auth.authHeaders(),
    });
  }

  /** PUT /api/lineaHistorial/:id */
  updateLinea(idLinea: number, dto: UpdateLineaHistorialDto): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idLinea}`, dto, {
      headers: this.auth.authHeaders(),
    });
  }

  /** DELETE /api/lineaHistorial/:id */
  deleteLinea(idLinea: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${idLinea}`, {
      headers: this.auth.authHeaders(),
    });
  }
}
