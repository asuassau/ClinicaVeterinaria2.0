import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HistorialService, Historial } from 'src/app/services/historial.service';
import { LineaHistorialService } from 'src/app/services/linea-historial.service';

import { UsuarioService, Usuario } from 'src/app/services/usuario.service';
import { AnimalService, Animal } from 'src/app/services/animal.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


type EstadoHistorial = 'Activo' | 'Inactivo';
type EstadoFiltro = EstadoHistorial | 'todos';

interface HistorialVM {
  idHistorial: number;
  idAnimal: number;

  animalNombre: string;
  especie: string;
  raza: string;

  duenoLabel: string; // DNI/NIF - Nombre Apellidos
  estado: EstadoHistorial;
  fechaAlta?: string;
}

@Component({
  selector: 'app-list-historiales',
  templateUrl: './list-historiales.page.html',
  styleUrls: ['./list-historiales.page.scss'],
  standalone: false,
})
export class ListHistorialesPage {
  historiales: Historial[] = [];
  historialesVM: HistorialVM[] = [];
  historialesFiltrados: HistorialVM[] = [];

  animales: Animal[] = [];
  usuarios: Usuario[] = [];

  // ✅ filtros nuevos
  filtroEstado: EstadoFiltro = 'todos';
  filtroTexto = '';
  estados: EstadoHistorial[] = ['Activo', 'Inactivo'];

  loading = false;
  errorMsg = '';

  constructor(
    private historialService: HistorialService,
    private lineaHistorialService: LineaHistorialService, // (no obligatorio aquí)
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router,
    private permisos: PermisosService
  ) {}


get canNuevo(): boolean {
  return this.permisos.can('historiales', 'nuevo');
}

get canEliminar(): boolean {
  return this.permisos.can('historiales', 'eliminar');
}

get canVer(): boolean {
  return this.permisos.can('historiales', 'ver');
}


  ionViewWillEnter() {

    this.cargarTodo();

  }

  private cargarTodo() {
    this.loading = true;
    this.errorMsg = '';

    // 1) usuarios -> 2) animales -> 3) historiales
    this.usuarioService.getUsuarios().subscribe({
      next: (u) => {
        this.usuarios = u || [];

        this.animalService.getAnimales().subscribe({
          next: (a) => {
            this.animales = a || [];
            this.cargarHistoriales();
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

  private cargarHistoriales() {
    this.historialService.getHistoriales().subscribe({
      next: (data) => {
        this.historiales = data || [];

        // ✅ Construcción VM con JOIN (como tu versión que funciona)
        this.historialesVM = this.historiales.map((h: any) => {
          const a: any = this.animales.find(x => x.idAnimal === h.idAnimal);

          const animalNombre = a?.nombre ?? '(sin nombre)';
          const especie = a?.especie ?? '-';
          const raza = a?.raza ?? '-';

          const idDueno = Number(a?.idUsuario ?? 0);
          const duenoLabel = this.labelDueno(idDueno);

          return {
            idHistorial: Number(h.idHistorial),
            idAnimal: Number(h.idAnimal),

            animalNombre,
            especie,
            raza,
            duenoLabel,

            estado: (h.estado as EstadoHistorial) || 'Activo',
            fechaAlta: String(h.fechaAlta || '')
          };
        });

        // Ordenar por id desc
        this.historialesVM.sort((x, y) => (y.idHistorial ?? 0) - (x.idHistorial ?? 0));

        // ✅ aplicar filtros/búsqueda
        this.aplicarFiltros();

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando historiales';
      }
    });
  }

  // ✅ filtros + búsqueda
  aplicarFiltros() {
    const q = (this.filtroTexto || '').toLowerCase().trim();

    this.historialesFiltrados = this.historialesVM.filter(h => {
      const coincideEstado =
        this.filtroEstado === 'todos'
          ? true
          : h.estado === this.filtroEstado;

      const texto = `
        ${h.idHistorial}
        ${h.idAnimal}
        ${h.animalNombre}
        ${h.especie}
        ${h.raza}
        ${h.duenoLabel}
        ${h.estado}
        ${h.fechaAlta || ''}
      `.toLowerCase();

      const coincideTexto = q === '' ? true : texto.includes(q);

      return coincideEstado && coincideTexto;
    });
  }

  limpiarFiltros() {
    this.filtroEstado = 'todos';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  // ====== Acciones ======

  crearHistorial() {
    this.router.navigate(['/form-historiales']);
  }

  verDetalle(vm: HistorialVM) {
    this.router.navigate(['/edit-historiales', vm.idHistorial]);
  }

  eliminarHistorial(vm: HistorialVM) {
    if (!confirm(
      `¿Seguro que quieres eliminar el historial ID ${vm.idHistorial}?\n\nSe eliminarán también sus líneas de historial.`
    )) return;

    this.historialService.deleteHistorial(vm.idHistorial).subscribe({
      next: () => this.cargarTodo(),
      error: (err) => alert(err?.error?.message || 'Error eliminando historial')
    });
  }

  verLineas(vm: HistorialVM) {
    this.router.navigate(['/list-lineas-historiales'], {
      queryParams: { idHistorial: vm.idHistorial }
    });
  }

  // ====== Helpers ======
  private labelDueno(idUsuario: number): string {
    if (!idUsuario) return '(sin dueño)';

    const u: any = this.usuarios.find(x => x.idUsuario === idUsuario);
    if (!u) return `${idUsuario} - (sin datos)`;

    const dni = (u.dni ?? u.nif ?? u.DNI ?? u.NIF ?? '').toString().trim();
    const nombre = `${u.nombre || ''} ${u.apellidos || ''}`.trim();

    const left = dni ? dni : String(u.idUsuario);
    return `${left} - ${nombre || '(sin nombre)'}`;
  }

      volver() {
    this.router.navigate(['/menu']);  
  }
}
