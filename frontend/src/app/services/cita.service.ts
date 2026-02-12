import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

export type EstadoCita = 'pendiente' | 'confirmada' | 'atendida' | 'cancelada';

export interface Cita {
  idCita: number;

  // backend: DATEONLY
  fecha: string; // 'YYYY-MM-DD'

  // backend: TIME
  HoraIni: string; // 'HH:mm:ss' (o 'HH:mm')
  HoraFin: string; // 'HH:mm:ss' (o 'HH:mm')

  motivo?: string | null;
  estado: EstadoCita;
  notas?: string | null;

  idAnimal: number;
  idUsuario_programa: number;
  idUsuario_atiende: number;
}

/**
 * CREATE: tu controller exige:
 * fecha, HoraIni, HoraFin, estado, idAnimal, idUsuario_programa, idUsuario_atiende
 */
export interface CreateCitaDto {
  fecha: string; // 'YYYY-MM-DD'
  HoraIni: string; // 'HH:mm' o 'HH:mm:ss'
  HoraFin: string; // 'HH:mm' o 'HH:mm:ss'
  estado: EstadoCita;

  idAnimal: number;
  idUsuario_programa: number;
  idUsuario_atiende: number;

  motivo?: string;
  notas?: string;
}

/**
 * UPDATE: permites actualizar lo que venga en req.body.
 * (Puedes mandar parcial)
 */
export interface UpdateCitaDto {
  fecha?: string;
  HoraIni?: string;
  HoraFin?: string;
  estado?: EstadoCita;

  idAnimal?: number;
  idUsuario_programa?: number;
  idUsuario_atiende?: number;

  motivo?: string | null;
  notas?: string | null;
}

@Injectable({ providedIn: 'root' })
export class CitaService {
  private apiUrl = 'http://localhost:8080/api/cita';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** GET /api/cita */
  getCitas(): Observable<Cita[]> {
    return this.http.get<Cita[]>(this.apiUrl, {
      headers: this.authService.authHeaders(),
    });
  }

  /** GET /api/cita/:id */
  getCitaById(idCita: number): Observable<Cita> {
    return this.http.get<Cita>(`${this.apiUrl}/${idCita}`, {
      headers: this.authService.authHeaders(),
    });
  }

  /** POST /api/cita */
  createCita(payload: CreateCitaDto): Observable<Cita> {
    // Normaliza por si te llega HH:mm -> HH:mm:ss (opcional)
    const body = this.normalizeTimes(payload);
    return this.http.post<Cita>(this.apiUrl, body, {
      headers: this.authService.authHeaders(),
    });
  }

  /** PUT /api/cita/:id */
  updateCita(idCita: number, payload: UpdateCitaDto): Observable<any> {
    const body = this.normalizeTimes(payload);
    return this.http.put(`${this.apiUrl}/${idCita}`, body, {
      headers: this.authService.authHeaders(),
    });
  }

  /** DELETE /api/cita/:id */
  deleteCita(idCita: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idCita}`, {
      headers: this.authService.authHeaders(),
    });
  }

  // =========================
  // Helpers opcionales útiles
  // =========================

  /**
   * Filtrar citas por animal (frontend)
   */
  getCitasByAnimal(idAnimal: number): Observable<Cita[]> {
    return this.getCitas().pipe(
      map(list => list.filter(c => c.idAnimal === idAnimal))
    );
  }

  /**
   * Filtrar citas por fecha exacta 'YYYY-MM-DD' (frontend)
   */
  getCitasByFecha(fecha: string): Observable<Cita[]> {
    return this.getCitas().pipe(
      map(list => list.filter(c => c.fecha === fecha))
    );
  }

  /**
   * Normaliza HoraIni/HoraFin a HH:mm:ss si vienen como HH:mm
   * (Tu backend con Sequelize TIME suele aceptar ambas, pero así vas seguro)
   */
  private normalizeTimes<T extends { HoraIni?: string; HoraFin?: string }>(obj: T): T {
    const fix = (t?: string) => {
      if (!t) return t;
      // si viene "10:30" => "10:30:00"
      if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
      return t;
    };

    return {
      ...obj,
      HoraIni: fix(obj.HoraIni),
      HoraFin: fix(obj.HoraFin),
    };
  }
}
