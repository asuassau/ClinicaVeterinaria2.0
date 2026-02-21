import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Cita, CitaService } from '../../services/cita.service';
import { Animal, AnimalService } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';

interface CitaVM {
  cita: Cita;

  animalNombre: string;
  propietarioNombre: string;
  nifPropietario: string;
  veterinarioNombre: string;

  fecha: string;
  horaIni: string;
  estado: string;

  idUsuario_atiende: number;
  idUsuario_dueno: number | null;
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
    private auth: AuthService,
    private router: Router,
    private permisos: PermisosService
  ) {}

  // =====================
  // Permisos base
  // =====================

  get canNuevo(): boolean {
    return this.permisos.can('citas', 'nuevo');
  }

  get canVer(): boolean {
    if (this.isCliente) {
      return this.permisos.can('citas', 'ver', { esPropietario: true });
    }
    return this.permisos.can('citas', 'ver');
  }

  get role(): string | null {
    return this.auth.getUserRole();
  }

  get isCliente(): boolean {
    return this.role === 'cliente';
  }

  get idUsuarioLogueado(): number {
    return Number(this.auth.getUser()?.idUsuario ?? 0);
  }

  ionViewWillEnter() {
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }
      if (this.isCliente && !this.idUsuarioLogueado) {
      this.router.navigate(['/menu']);
      return;
    }

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

        this.veterinarios = usuarios.filter(u => u.rol === 'veterinario');

        this.citas = (citas || []).map(c => {

          const animal = mapAnimales.get(c.idAnimal);
          const duenoId = animal ? Number((animal as any).idUsuario) : 0;

          const dueno = duenoId ? mapUsuarios.get(duenoId) : undefined;
          const vet = mapUsuarios.get(c.idUsuario_atiende);

          return {
            cita: c,
            animalNombre: animal?.nombre ?? '—',
            propietarioNombre: dueno
              ? `${dueno.nombre ?? ''} ${dueno.apellidos ?? ''}`.trim()
              : '—',
            nifPropietario: dueno
              ?.nif ?? '—',    
            veterinarioNombre: vet
              ? `${vet.nombre ?? ''} ${vet.apellidos ?? ''}`.trim()
              : '—',
            fecha: c.fecha,
            horaIni: (c.HoraIni ?? '').slice(0, 5),
            estado: c.estado,
            idUsuario_atiende: c.idUsuario_atiende,
            idUsuario_dueno: duenoId || null
          };
        });

        // ✅ Cliente: solo sus citas
        if (this.isCliente) {
          const id = this.idUsuarioLogueado;
          this.citas = this.citas.filter(vm => vm.idUsuario_dueno === id);
        }

        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando citas';
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
        `${vm.propietarioNombre} ${vm.animalNombre} ${vm.veterinarioNombre} ${vm.fecha} ${vm.horaIni} ${vm.estado}${vm.nifPropietario}`
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

  // =====================
  // Permiso contextual
  // =====================

  canEliminarVm(vm: CitaVM): boolean {
    return this.permisos.can('citas', 'eliminar', {
      estadoCita: vm.estado
    });
  }

  crearCita() {
    this.router.navigate(['/form-citas']);
  }

  verDetalle(vm: CitaVM) {
    this.router.navigate(['/edit-citas', vm.cita.idCita]);
  }

  eliminarCita(vm: CitaVM) {
    if (!this.canEliminarVm(vm)) return;

    if (!confirm(`¿Eliminar la cita del ${vm.fecha} a las ${vm.horaIni}?`)) return;

    this.citaService.deleteCita(vm.cita.idCita).subscribe({
      next: () => this.cargarTodo(),
      error: () => alert('Error eliminando la cita'),
    });
  }
    volver() {
    this.router.navigate(['/menu']);  
  }
  
}
