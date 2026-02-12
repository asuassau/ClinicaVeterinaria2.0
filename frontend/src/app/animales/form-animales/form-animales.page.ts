import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService, CreateAnimalDto } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';

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
    foto: null,
    idUsuario: null as any, // lo dejamos null hasta seleccionar
  };

  constructor(
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ionViewWillEnter() {
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
    return `${u.idUsuario} - ${name}`;
  }

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';
    this.loading = true;

    // Normaliza datos antes de enviar
    const payload: CreateAnimalDto = {
      ...this.form,
      nombre: (this.form.nombre ?? '').trim(),
      especie: (this.form.especie ?? '').trim(),
      raza: (this.form.raza ?? '').trim() || null,
      observaciones: (this.form.observaciones ?? '').trim() || null,
      Fechanac: this.form.Fechanac || null,
      sexo: this.form.sexo || null,
      foto: this.form.foto || null,
      idUsuario: Number(this.form.idUsuario),
    };

    this.animalService.createAnimal(payload).subscribe({
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
}
