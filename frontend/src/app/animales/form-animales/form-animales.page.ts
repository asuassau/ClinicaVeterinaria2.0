import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService, CreateAnimalDto } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { PhotoService } from '../../services/photo.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


@Component({
  selector: 'app-form-animales',
  templateUrl: './form-animales.page.html',
  styleUrls: ['./form-animales.page.scss'],
  standalone: false,
})
export class FormAnimalesPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  usuarios: Usuario[] = [];

  // Modelo para crear Animal
  form: CreateAnimalDto = {
    nombre: '',
    especie: '',
    raza: '',
    Fechanac: null,
    sexo: null,
    observaciones: '',
    //foto: null,
    idUsuario: null as any, // lo dejamos null hasta seleccionar
  };

  constructor(
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router,
    private permisos: PermisosService,
    private photoService: PhotoService,
  ) {}

  capturedPhoto: string = "";
  originalPhoto: string = "";

  removeImage = false;



  get canNuevo(): boolean {
  return this.permisos.can('animales', 'nuevo');
}

  ionViewWillEnter() {
if (!this.canNuevo) {
  this.router.navigate(['/menu']);
  return;
}

    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data ?? [];
      },
      error: (err) => {
        this.errorMsg =
          err?.error?.message || 'No se pudieron cargar los usuarios (propietarios).';
      }
    });
  }

  ownerLabel(u: Usuario): string {
    const fullName = `${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
    const name = fullName || u.email || `Usuario ${u.idUsuario}`;
    return `${u.nif} - ${name}`;
  }

  async guardar() {
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

    // Normaliza datos antes de enviar
    const payload: CreateAnimalDto = {
      ...this.form,
      nombre: (this.form.nombre ?? '').trim(),
      especie: (this.form.especie ?? '').trim(),
      raza: (this.form.raza ?? '').trim() || null,
      observaciones: (this.form.observaciones ?? '').trim() || null,
      Fechanac: this.form.Fechanac || null,
      sexo: this.form.sexo || null,
      //foto: this.form.foto || null,
      idUsuario: Number(this.form.idUsuario),
    };

    this.animalService.createAnimal(payload, blob ?? undefined).subscribe({
      next: () => {
        this.loading = false;
        this.okMsg = 'Animal creado correctamente';
        setTimeout(() => this.router.navigate(['/list-animales']), 600);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message || 'Error creando animales (revisa backend/token).';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-animales']);
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
