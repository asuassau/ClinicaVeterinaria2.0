import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Animal, AnimalService } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';

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
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.cargarDatos();
  }

  private async cargarDatos() {
    this.loading = true;
    this.errorMsg = '';

    // Cargamos usuarios y animales en paralelo
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.ownerNameById = this.buildOwnerMap(usuarios);

        this.animalService.getAnimales().subscribe({
          next: (animales) => {
            this.animales = animales;
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
            this.animales = animales;
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
      const fullName = `${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
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
    if (!confirm(`¿Seguro que quieres eliminar a ${animal.nombre}?`)) return;

    this.animalService.deleteAnimal(animal.idAnimal).subscribe({
      next: () => this.cargarDatos(),
      error: () => alert('Error eliminando animal'),
    });
  }

  verDetalle(animal: Animal) {
    // Ajusta esta ruta cuando crees el detalle
    this.router.navigate(['/edit-animales', animal.idAnimal]);
  }

  crearAnimal() {
    // Ajusta esta ruta cuando crees el formulario
    this.router.navigate(['/form-animales']);
  }
}
