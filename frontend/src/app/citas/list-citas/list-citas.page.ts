import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Cita, CitaService } from '../../services/cita.service';
import { Animal, AnimalService } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';

interface CitaVM {
  cita: Cita;

  animalNombre: string;
  propietarioNombre: string;   // animal.idUsuario -> Usuario
  veterinarioNombre: string;   // cita.idUsuario_atiende -> Usuario

  fecha: string;
  horaIni: string;
  estado: string;

  // para filtros
  idUsuario_atiende: number;
}

@Component({
  selector: 'app-list-citas',
  templateUrl: './list-citas.page.html',
  styleUrls: ['./list-citas.page.scss'],
  standalone: false,
})
export class ListCitasPage {

  citas: CitaVM[] = [];
  citasFiltradas: CitaVM[] = [];

  veterinarios: Usuario[] = [];

  filtroVeterinario: number | 'todos' = 'todos';
  filtroTexto = '';

  loading = false;
  errorMsg = '';

  constructor(
    private citaService: CitaService,
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.cargarTodo();
  }

  cargarTodo() {
    this.loading = true;
    this.errorMsg = '';

    forkJoin({
      citas: this.citaService.getCitas(),
      animales: this.animalService.getAnimales(),
      usuarios: this.usuarioService.getUsuarios(),
    }).subscribe({
      next: ({ citas, animales, usuarios }) => {
        const mapUsuarios = new Map<number, Usuario>();
        usuarios.forEach(u => mapUsuarios.set(u.idUsuario, u));

        const mapAnimales = new Map<number, Animal>();
        animales.forEach(a => mapAnimales.set(a.idAnimal, a));

        // desplegable de veterinarios
        this.veterinarios = usuarios.filter(u => u.rol === 'veterinario');

        // Construimos VM aplicando relaciones reales:
        // cita.idAnimal -> Animal
        // animal.idUsuario -> Usuario (dueño)
        // cita.idUsuario_atiende -> Usuario (vet)
        this.citas = citas.map(c => {
          const animal = mapAnimales.get(c.idAnimal);
          const dueno = animal ? mapUsuarios.get(animal.idUsuario) : undefined;
          const vet = mapUsuarios.get(c.idUsuario_atiende);

          const propietarioNombre = dueno
            ? `${dueno.nombre ?? ''} ${dueno.apellidos ?? ''}`.trim()
            : '—';

          const veterinarioNombre = vet
            ? `${vet.nombre ?? ''} ${vet.apellidos ?? ''}`.trim()
            : '—';

          return {
            cita: c,
            animalNombre: animal?.nombre ?? '—',
            propietarioNombre,
            veterinarioNombre,
            fecha: c.fecha,
            horaIni: (c.HoraIni ?? '').slice(0, 5),
            estado: c.estado,
            idUsuario_atiende: c.idUsuario_atiende
          };
        });

        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando citas/animales/usuarios';
      }
    });
  }

  aplicarFiltros() {
    const txt = this.filtroTexto.toLowerCase().trim();

    this.citasFiltradas = this.citas.filter(vm => {

      const okVet =
        this.filtroVeterinario === 'todos'
          ? true
          : vm.idUsuario_atiende === this.filtroVeterinario;

      const searchable =
        `${vm.propietarioNombre} ${vm.animalNombre} ${vm.veterinarioNombre} ${vm.fecha} ${vm.horaIni} ${vm.estado}`
          .toLowerCase();

      const okTxt = txt === '' ? true : searchable.includes(txt);

      return okVet && okTxt;
    });
  }

  limpiarFiltros() {
    this.filtroVeterinario = 'todos';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  crearCita() {
    this.router.navigate(['/form-citas']);
  }

  verDetalle(vm: CitaVM) {
    this.router.navigate(['/edit-citas', vm.cita.idCita]);
  }

  eliminarCita(vm: CitaVM) {
    if (!confirm(`¿Eliminar la cita del ${vm.fecha} a las ${vm.horaIni}?`)) return;

    this.citaService.deleteCita(vm.cita.idCita).subscribe({
      next: () => this.cargarTodo(),
      error: () => alert('Error eliminando la cita'),
    });
  }
}
