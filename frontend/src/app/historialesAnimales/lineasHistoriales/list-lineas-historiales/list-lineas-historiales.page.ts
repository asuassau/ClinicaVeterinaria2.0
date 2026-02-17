import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LineaHistorialService, LineaHistorial } from 'src/app/services/linea-historial.service';
import { HistorialService, Historial } from 'src/app/services/historial.service';
import { AnimalService, Animal } from 'src/app/services/animal.service';
import { UsuarioService, Usuario } from 'src/app/services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';


type AutorFiltro = number | 'todos';

interface LineaVM {
  idLineaHistorial: number;
  idHistorial: number;

  fechaCreacion: string;
  fechaEdicion: string; // '-' si null
  idUsuario: number;

  autorLabel: string;   // DNI - Nombre Apellidos
  descripcion: string;
}

@Component({
  selector: 'app-list-lineas-historiales',
  templateUrl: './list-lineas-historiales.page.html',
  styleUrls: ['./list-lineas-historiales.page.scss'],
  standalone: false,
})
export class ListLineasHistorialesPage {
  loading = false;
  errorMsg = '';

  idHistorial!: number;

  // referencia en cabecera
  historial: Historial | null = null;
  animal: Animal | null = null;

  // datos
  usuarios: Usuario[] = [];
  lineas: LineaHistorial[] = [];
  lineasVM: LineaVM[] = [];
  lineasFiltradas: LineaVM[] = [];

  // filtros
  filtroAutor: AutorFiltro = 'todos';
  filtroTexto = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private lineaService: LineaHistorialService,
    private historialService: HistorialService,
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private permisos: PermisosService
  ) {}

get canNuevo(): boolean {
  return this.permisos.can('lineasHistorial', 'nuevo');
}

get canEliminar(): boolean {
  return this.permisos.can('lineasHistorial', 'eliminar');
}

get canVer(): boolean {
  return this.permisos.can('lineasHistorial', 'ver');
}


  ionViewWillEnter() {
    const id = this.route.snapshot.queryParamMap.get('idHistorial');
    this.idHistorial = Number(id);

    if (!this.idHistorial) {
      this.errorMsg = 'ID de historial inválido.';
      return;
    }

    this.cargarTodo();
  }

  private cargarTodo() {
    this.loading = true;
    this.errorMsg = '';

    // 1) usuarios -> 2) historial (y animal) -> 3) lineas
    this.usuarioService.getUsuarios().subscribe({
      next: (u) => {
        this.usuarios = u || [];
        this.cargarHistorialRef();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios';
      }
    });
  }

  private cargarHistorialRef() {
    this.historialService.getHistorialById(this.idHistorial).subscribe({
      next: (h) => {
        this.historial = h;

        // cargar animal para referencia (nombre/especie/raza y dueño si quieres mostrar)
        const idAnimal = Number((h as any)?.idAnimal ?? 0);
        if (idAnimal) {
          this.animalService.getAnimalById(idAnimal).subscribe({
            next: (a) => (this.animal = a),
            error: () => {}
          });
        }

        this.cargarLineas();
      },
      error: (err) => {
        // aunque falle la referencia, intentamos cargar lineas igualmente
        this.historial = null;
        this.cargarLineas();
      }
    });
  }

  private cargarLineas() {
    this.lineaService.getLineasByHistorial(this.idHistorial, false).subscribe({
      next: (data) => {
        this.lineas = data || [];

        this.lineasVM = this.lineas.map((l: any) => ({
          idLineaHistorial: Number(l.idLineaHistorial),
          idHistorial: Number(l.idHistorial),
          fechaCreacion: String(l.fechaCreacion || ''),
          fechaEdicion: l.fechaEdicion ? String(l.fechaEdicion) : '-',
          idUsuario: Number(l.idUsuario),
          autorLabel: this.labelAutor(Number(l.idUsuario)),
          descripcion: String(l.descripcion || ''),
        }));

        // ordenar: más recientes primero (por id o por fecha)
        this.lineasVM.sort((a, b) => (b.idLineaHistorial ?? 0) - (a.idLineaHistorial ?? 0));

        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando líneas de historial.';
      }
    });
  }

  // ===== filtros =====
  aplicarFiltros() {
    const q = (this.filtroTexto || '').toLowerCase().trim();

    this.lineasFiltradas = this.lineasVM.filter(l => {
      const coincideAutor =
        this.filtroAutor === 'todos'
          ? true
          : l.idUsuario === this.filtroAutor;

      const texto = `
        ${this.formatFecha(l.fechaCreacion)}
        ${this.formatHora(l.fechaCreacion)}
        ${this.formatFecha(l.fechaEdicion)}
        ${this.formatHora(l.fechaEdicion)}
        ${l.autorLabel}
        ${l.descripcion}
      `.toLowerCase();

      const coincideTexto = q === '' ? true : texto.includes(q);

      return coincideAutor && coincideTexto;
    });
  }

  limpiarFiltros() {
    this.filtroAutor = 'todos';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  // ===== acciones =====
  crearLinea() {
    this.router.navigate(['/form-lineas-historiales'], {
      queryParams: { idHistorial: this.idHistorial }
    });
  }

  verDetalle(vm: LineaVM) {
    this.router.navigate(['/edit-lineas-historiales', vm.idLineaHistorial]);
  }

  eliminarLinea(vm: LineaVM) {
    if (!confirm(`¿Eliminar esta línea de historial?\n\nAutor: ${vm.autorLabel}`)) return;

    this.lineaService.deleteLinea(vm.idLineaHistorial).subscribe({
      next: () => this.cargarTodo(),
      error: (err) => alert(err?.error?.message || 'Error eliminando línea de historial')
    });
  }

  volverAHistoriales() {
    this.router.navigate(['/list-historiales']);
  }

  // ===== helpers =====
  autoresDisponibles(): { idUsuario: number; label: string }[] {
    const ids = new Set<number>();
    this.lineasVM.forEach(l => ids.add(l.idUsuario));

    return Array.from(ids)
      .map(id => ({ idUsuario: id, label: this.labelAutor(id) }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private labelAutor(idUsuario: number): string {
    if (!idUsuario) return '(sin autor)';

    const u: any = this.usuarios.find(x => x.idUsuario === idUsuario);
    if (!u) return `${idUsuario} - (sin datos)`;

    const dni = (u.dni ?? u.nif ?? u.DNI ?? u.NIF ?? '').toString().trim();
    const nombre = `${u.nombre || ''} ${u.apellidos || ''}`.trim();

    const left = dni ? dni : String(u.idUsuario);
    return `${left} - ${nombre || '(sin nombre)'}`;
  }

  formatFecha(iso: any): string {
    if (!iso || iso === '-') return '-';
    const s = String(iso);
    // ISO: 2026-02-14T12:34:56.000Z
    return s.length >= 10 ? s.substring(0, 10) : s;
  }

  formatHora(iso: any): string {
    if (!iso || iso === '-') return '-';
    const s = String(iso);
    // intenta tomar HH:mm
    const tIndex = s.indexOf('T');
    if (tIndex >= 0 && s.length >= tIndex + 6) {
      return s.substring(tIndex + 1, tIndex + 6); // HH:mm
    }
    // fallback
    return '-';
  }

  historialRefLabel(): string {
    if (!this.historial) return `Historial #${this.idHistorial}`;
    const idAnimal = (this.historial as any)?.idAnimal ? ` (Animal #${(this.historial as any).idAnimal})` : '';
    return `Historial #${this.historial.idHistorial}${idAnimal}`;
  }

  animalRefLabel(): string {
    if (!this.animal) return '';
    const nombre = (this.animal as any)?.nombre || '';
    const especie = (this.animal as any)?.especie || '';
    const raza = (this.animal as any)?.raza || '';
    const txt = `${nombre}`.trim();
    const extra = [especie, raza].filter(Boolean).join(' · ');
    return extra ? `${txt} (${extra})` : txt;
  }
}
