import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type Role = 'administrador' | 'veterinario' | 'recepcionista' | 'cliente';

export interface Usuario {
  idUsuario: number;
  nif: string | null;
  nombre: string;
  apellidos: string | null;
  email: string;
  telefono: string | null;
  direccion: string | null;
  foto: string | null;
  rol: Role;

  // el backend lo devuelve ahora, pero luego lo quitarás:
  contrasena?: string;
}

/**
 * Payload para CREAR usuario (POST /api/usuario)
 * En create el backend exige email y contrasena.
 */
export interface CreateUsuarioDto {
  nombre?: string;
  apellidos?: string;
  email: string;
  rol?: Role;
  nif?: string;
  direccion?: string;
  telefono?: string;

  // requerido para crear
  contrasena: string;
}

/**
 * Payload para ACTUALIZAR usuario (PUT /api/usuario/:id)
 * contrasena es opcional (si viene, backend la hashea).
 */
export interface UpdateUsuarioDto {
  nombre?: string;
  apellidos?: string;
  email?: string;
  rol?: Role;
  nif?: string;
  direccion?: string;
  telefono?: string;

  // opcional en update
  contrasena?: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuario';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** GET /api/usuario */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl, {
      headers: this.authService.authHeaders(),
    });
  }

  /** GET /api/usuario/:id */
  getUsuarioById(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${idUsuario}`, {
      headers: this.authService.authHeaders(),
    });
  }

  /** POST /api/usuario  (requiere auth + contrasena) */
  createUsuario(payload: CreateUsuarioDto): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, payload, {
      headers: this.authService.authHeaders(),
    });
  }

  /** PUT /api/usuario/:id  (requiere auth, contrasena opcional) */
  updateUsuario(idUsuario: number, payload: UpdateUsuarioDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idUsuario}`, payload, {
      headers: this.authService.authHeaders(),
    });
  }

  /** DELETE /api/usuario/:id */
  deleteUsuario(idUsuario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idUsuario}`, {
      headers: this.authService.authHeaders(),
    });
  }
}
