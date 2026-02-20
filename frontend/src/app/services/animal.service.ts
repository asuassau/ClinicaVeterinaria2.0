import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export type SexoAnimal = 'M' | 'H';

export interface Animal {
  idAnimal: number;
  nombre: string;
  especie: string;
  raza: string | null;
  Fechanac: string | null;      // DATEONLY -> "YYYY-MM-DD"
  sexo: SexoAnimal | null;
  observaciones: string | null;
  foto: string | null;
  idUsuario: number;
}

/**
 * Payload para CREAR animal (POST /api/animal)
 * Controller exige nombre e idUsuario.
 * Modelo exige especie (allowNull: false) => también obligatorio.
 */
export interface CreateAnimalDto {
  nombre: string;
  especie: string;
  idUsuario: number;

  raza?: string | null;
  Fechanac?: string | null; // "YYYY-MM-DD"
  sexo?: SexoAnimal | null;
  observaciones?: string | null;

}

/**
 * Payload para ACTUALIZAR animal (PUT /api/animal/:id)
 * Puede venir parcial.
 */
export interface UpdateAnimalDto {
  nombre?: string;
  especie?: string;
  idUsuario?: number;

  raza?: string | null;
  Fechanac?: string | null;
  sexo?: SexoAnimal | null;
  observaciones?: string | null;
  foto?: string | null;
}

@Injectable({ providedIn: 'root' })
export class AnimalService {
  private apiUrl = 'http://localhost:8080/api/animal';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** GET /api/animal */
  getAnimales(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl, {
      headers: this.authService.authHeaders(),
    });
  }

  /** GET /api/animal/:id */
  getAnimalById(idAnimal: number): Observable<Animal> {
    return this.http.get<Animal>(`${this.apiUrl}/${idAnimal}`, {
      headers: this.authService.authHeaders(),
    });
  }

  /** POST /api/animal */
  createAnimal(payload: CreateAnimalDto,file?:Blob): Observable<Animal> {

    
      const formData = new FormData();
      formData.append('nombre', payload.nombre);
      formData.append('especie', payload.especie);
      formData.append('idUsuario', payload.idUsuario.toString());
      if (payload.raza) {
        formData.append('raza', payload.raza);
      } 
      if (payload.Fechanac) {
        formData.append('Fechanac', payload.Fechanac);
      } 
      if (payload.sexo) {
        formData.append('sexo', payload.sexo);
      } 
      if (payload.observaciones) {
        formData.append('observaciones', payload.observaciones);
      } 
    if (file) {
  formData.append('file', file, 'animal.jpg');
}
    
    return this.http.post<Animal>(this.apiUrl, formData, {
      headers: this.authService.authHeaders(),
    });
  }

  /** PUT /api/animal/:id */
  updateAnimal(idAnimal: number, payload: UpdateAnimalDto, file?:Blob): Observable<any> {

      const formData = new FormData();

const removeImage = (payload as any).removeImage;
if (removeImage !== undefined) {
  formData.append('removeImage', String(removeImage));
}
      if (payload.nombre) {
        formData.append('nombre', payload.nombre);
      }           
      if (payload.especie) {  
        formData.append('especie', payload.especie);
      }
      if (payload.idUsuario) {
        formData.append('idUsuario', payload.idUsuario.toString());
      } 
      if (payload.raza) {
        formData.append('raza', payload.raza);
      } 
      if (payload.Fechanac) {
        formData.append('Fechanac', payload.Fechanac);
      } 
      if (payload.sexo) {
        formData.append('sexo', payload.sexo);
      } 
      if (payload.observaciones) {
        formData.append('observaciones', payload.observaciones);
      } 
    if (file) {
  formData.append('file', file, 'animal.jpg');
}


    return this.http.put(`${this.apiUrl}/${idAnimal}`, formData, {
      headers: this.authService.authHeaders(),
    });
  }

  /** DELETE /api/animal/:id */
  deleteAnimal(idAnimal: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idAnimal}`, {
      headers: this.authService.authHeaders(),
    });
  }
}
