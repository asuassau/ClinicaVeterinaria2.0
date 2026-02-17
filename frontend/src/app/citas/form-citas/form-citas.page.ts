import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CitaService, CreateCitaDto } from '../../services/cita.service';
import { AnimalService, Animal } from '../../services/animal.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


@Component({
  selector: 'app-form-citas',
  templateUrl: './form-citas.page.html',
  styleUrls: ['./form-citas.page.scss'],
  standalone: false,
})
export class FormCitasPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  // datos para los selects
  usuarios: Usuario[] = [];
  veterinarios: Usuario[] = [];
  programadores: Usuario[] = [];
  animales: Animal[] = [];

  // Mapa idUsuario -> Usuario para resolver dueño del animal
  private usuariosById = new Map<number, Usuario>();

  // DTO para crear cita (según tu backend)
  form: CreateCitaDto = {
    fecha: '',
    HoraIni: '',
    HoraFin: '',
    estado: 'pendiente',

    idAnimal: null as any,
    idUsuario_programa: null as any,
    idUsuario_atiende: null as any,

    motivo: '',
    notas: '',
  };

  estados: Array<CreateCitaDto['estado']> = [
    'pendiente',
    'confirmada',
    'atendida',
    'cancelada',
  ];

  constructor(
    private citaService: CitaService,
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router,
    private permisos: PermisosService
  ) {}

  get canNuevo(): boolean {
  return this.permisos.can('citas', 'nuevo');
}
  
  ionViewWillEnter() {

    if (!this.canNuevo) {
  this.router.navigate(['/menu']);
  return;
}
    this.cargarDatos();
  }

  private cargarDatos() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    // 1) usuarios
    this.usuarioService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = users;
        this.usuariosById = new Map<number, Usuario>();
        users.forEach(u => this.usuariosById.set(u.idUsuario, u));

        // veterinarios (rol veterinario)
        this.veterinarios = users.filter(u => u.rol === 'veterinario');

        // programadores (quien asigna): admin/recep por defecto
        this.programadores = users.filter(u => u.rol === 'administrador' || u.rol === 'recepcionista');

        // 2) animales
        // OJO: si tu método se llama distinto, cámbialo aquí:
        this.animalService.getAnimales().subscribe({
          next: (anis) => {
            this.animales = anis;
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.errorMsg = err?.error?.message || 'Error cargando animales';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios';
      }
    });
  }

  // label usuario: "id - Nombre Apellido"
  userLabel(u: Usuario): string {
    const ap = u.apellidos ? ` ${u.apellidos}` : '';
    return `${u.idUsuario} - ${u.nombre}${ap}`;
  }

  // label animal: "id - NombreAnimal (Dueño: Nombre Apellido)"
  animalLabel(a: Animal): string {
    const dueno = this.usuariosById.get(a.idUsuario);
    const duenoNombre = dueno
      ? `${dueno.nombre}${dueno.apellidos ? ' ' + dueno.apellidos : ''}`.trim()
      : `idUsuario ${a.idUsuario}`;

    return `${a.idAnimal} - ${a.nombre} (Dueño: ${duenoNombre})`;
  }

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';
    this.loading = true;

    // Normalizamos strings (por si vienen vacíos)
    const payload: CreateCitaDto = {
      ...this.form,
      motivo: this.form.motivo?.trim() || undefined,
      notas: this.form.notas?.trim() || undefined,
    };

    this.citaService.createCita(payload).subscribe({
      next: () => {
        this.loading = false;
        this.okMsg = 'Cita creada correctamente';
        setTimeout(() => this.router.navigate(['/list-citas']), 600);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg =
          err?.error?.message || 'Error creando cita (revisa backend/token).';
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-citas']);
  }
}
