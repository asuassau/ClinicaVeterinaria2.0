import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Animal, AnimalService } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-animales',
  templateUrl: './list-animales.page.html',
  styleUrls: ['./list-animales.page.scss'],
  standalone: false,
})
export class ListAnimalesPage {

  animales: Animal[] = [];
  animalesFiltrados: Animal[] = [];

  // Mapa idUsuario -> "Nombre Apellidos"
  ownerNameById: Record<number, string> = {};

  // Filtros
  filtroEspecie: string = 'todas';
  filtroTexto: string = '';

  // UI state
  loading = false;
  errorMsg = '';

  constructor(
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private router: Router,
    private permisos: PermisosService,
    private auth: AuthService
  ) {}

  get canVer(): boolean {
    // Cliente: permisos.ts exige ctx.esPropietario=true
    if (this.isCliente) {
      return this.permisos.can('animales', 'ver', { esPropietario: true });
    }
    return this.permisos.can('animales', 'ver');
  }

  get canNuevo(): boolean {
    return this.permisos.can('animales', 'nuevo');
  }

  get canEliminar(): boolean {
    return this.permisos.can('animales', 'eliminar');
  }

  // ✅ helpers rol/usuario
  get isCliente(): boolean {
    return (this.auth.getUserRole() || '') === 'cliente';
  }

  get idUsuarioLogueado(): number {
    return Number(this.auth.getUser()?.idUsuario ?? 0);
  }

  ionViewWillEnter() {
    // ✅ guard de acceso
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }
        if (this.isCliente && !this.idUsuarioLogueado) {
      this.router.navigate(['/menu']);
      return;
    }

    this.cargarDatos();
  }

  private cargarDatos() {
    this.loading = true;
    this.errorMsg = '';

    // Cargamos usuarios y animales
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.ownerNameById = this.buildOwnerMap(usuarios || []);

        this.animalService.getAnimales().subscribe({
          next: (animales) => {
            // ✅ filtro por propietario si es cliente
            const all = (animales || []);
            this.animales = this.isCliente
              ? all.filter(a => Number(a.idUsuario) === this.idUsuarioLogueado)
              : all;

            this.aplicarFiltros();
            this.loading = false;
          },
          error: (err) => {
            this.loading = false;
            this.errorMsg = err?.error?.message || 'Error cargando animales';
          }
        });
      },
      error: (err) => {
        // Si falla usuarios, aún puedes listar animales pero sin nombre de propietario
        this.ownerNameById = {};
        this.animalService.getAnimales().subscribe({
          next: (animales) => {
            const all = (animales || []);
            this.animales = this.isCliente
              ? all.filter(a => Number(a.idUsuario) === this.idUsuarioLogueado)
              : all;

            this.aplicarFiltros();
            this.loading = false;
            this.errorMsg =
              err?.error?.message ||
              'Aviso: no se pudieron cargar los propietarios (se listan animales igualmente).';
          },
          error: (err2) => {
            this.loading = false;
            this.errorMsg = err2?.error?.message || 'Error cargando animales';
          }
        });
      }
    });
  }

  private buildOwnerMap(usuarios: Usuario[]): Record<number, string> {
    const map: Record<number, string> = {};
    for (const u of usuarios) {
      const fullName = `${u.nombre ?? ''} ${u.apellidos ?? ''}${u.nif ? ' (' + u.nif + ')' : ''}`.trim();
      map[u.idUsuario] = fullName || u.email || `Usuario ${u.idUsuario}`;
    }
    return map;
  }

  getOwnerName(idUsuario: number): string {
    return this.ownerNameById[idUsuario] || `Usuario ${idUsuario}`;
  }

  // Para llenar el select de especies sin duplicados
  get especiesDisponibles(): string[] {
    const set = new Set<string>();
    for (const a of this.animales) {
      if (a.especie) set.add(a.especie);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  aplicarFiltros() {
    const txt = this.filtroTexto.toLowerCase().trim();

    this.animalesFiltrados = this.animales.filter(a => {
      const coincideEspecie =
        this.filtroEspecie === 'todas' ? true : (a.especie === this.filtroEspecie);

      const ownerName = this.getOwnerName(a.idUsuario).toLowerCase();
      const textoAnimal = `${a.nombre ?? ''} ${a.raza ?? ''} ${ownerName}`.toLowerCase();

      const coincideTexto = txt === '' ? true : textoAnimal.includes(txt);

      return coincideEspecie && coincideTexto;
    });
  }

  limpiarFiltros() {
    this.filtroEspecie = 'todas';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  eliminarAnimal(animal: Animal) {
    // ✅ seguridad extra (aunque el botón no salga)
    if (!this.canEliminar) return;

    if (!confirm(`¿Seguro que quieres eliminar a ${animal.nombre}?`)) return;

    this.animalService.deleteAnimal(animal.idAnimal).subscribe({
      next: () => this.cargarDatos(),
      error: () => alert('Error eliminando animal'),
    });
  }

  verDetalle(animal: Animal) {
    this.router.navigate(['/edit-animales', animal.idAnimal]);
  }

  crearAnimal() {
    this.router.navigate(['/form-animales']);
  }

      volver() {
    this.router.navigate(['/menu']);  
  }
}
