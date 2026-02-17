import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  HistorialService,
  Historial,
  EstadoHistorial,
  UpdateHistorialDto
} from 'src/app/services/historial.service';

import { AnimalService, Animal } from 'src/app/services/animal.service';
import { UsuarioService, Usuario } from 'src/app/services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';



interface AnimalSelectVM {
  idAnimal: number;
  animalNombre: string;
  idDueno: number;
  duenoNif: string;
  duenoNombreCompleto: string;
  label: string; // "NombreAnimal - nif + Nombre Apellido"
}

@Component({
  selector: 'app-edit-historiales',
  templateUrl: './edit-historiales.page.html',
  styleUrls: ['./edit-historiales.page.scss'],
  standalone: false,
})
export class EditHistorialesPage {
  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';

  editMode = false;

  historial: Historial | null = null;

  estados: EstadoHistorial[] = ['Activo', 'Inactivo'];
  animalesVM: AnimalSelectVM[] = [];

  form: {
    estado: EstadoHistorial;
    idAnimal: number | null;
  } = {
    estado: 'Activo',
    idAnimal: null,
  };

  private idHistorial!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private historialService: HistorialService,
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private permisos: PermisosService
  ) {}

get canEditar(): boolean {
  return this.permisos.can('historiales', 'editar');
}

get canVer(): boolean {
  return this.permisos.can('historiales', 'ver');
}


  ionViewWillEnter() {
    
    if (!this.canVer) {
  this.router.navigate(['/menu']);
  return;
}
    const id = this.route.snapshot.paramMap.get('id');
    this.idHistorial = Number(id);

    if (!this.idHistorial) {
      this.errorMsg = 'ID de historial inválido.';
      return;
    }

    this.cargarUsuariosAnimalesYHistorial();
  }

  private cargarUsuariosAnimalesYHistorial() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    // 1) usuarios -> 2) animales -> 3) historial
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.animalService.getAnimales().subscribe({
          next: (animales) => {
            this.animalesVM = this.buildAnimalesVM(usuarios || [], animales || []);

            this.historialService.getHistorialById(this.idHistorial, false).subscribe({
              next: (h) => {
                this.historial = h;
                this.precargarForm(h);
                this.loading = false;
              },
              error: (err) => {
                this.loading = false;
                this.errorMsg = err?.error?.message || 'Error cargando historial.';
              }
            });
          },
          error: (err) => {
            this.loading = false;
            this.errorMsg = err?.error?.message || 'Error cargando animales.';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios.';
      }
    });
  }

  private buildAnimalesVM(usuarios: Usuario[], animales: Animal[]): AnimalSelectVM[] {
    const vms: AnimalSelectVM[] = (animales || []).map((a: any) => {
      const idDueno = Number(a?.idUsuario ?? 0);
      const dueno: any = (usuarios || []).find((u: any) => Number(u.idUsuario) === idDueno);

      const nif = (dueno?.nif ?? dueno?.dni ?? dueno?.NIF ?? dueno?.DNI ?? '').toString().trim();
      const nombre = `${dueno?.nombre ?? ''} ${dueno?.apellidos ?? ''}`.trim();

      const animalNombre = (a?.nombre ?? '').toString().trim() || `(Animal ${a?.idAnimal})`;

      // Formato pedido: NombreAnimal - nif + nombre apellido
      const left = nif ? nif : String(idDueno);
      const label = `${animalNombre} - ${left}${nombre ? ' + ' + nombre : ''}`.trim();

      return {
        idAnimal: Number(a.idAnimal),
        animalNombre,
        idDueno,
        duenoNif: nif,
        duenoNombreCompleto: nombre,
        label
      };
    });

    vms.sort((x, y) => {
      const a = (x.animalNombre || '').localeCompare(y.animalNombre || '');
      return a !== 0 ? a : (x.idAnimal - y.idAnimal);
    });

    return vms;
  }

  private precargarForm(h: Historial) {
    this.form = {
      estado: (h.estado || 'Activo') as EstadoHistorial,
      idAnimal: h.idAnimal ? Number(h.idAnimal) : null,
    };
  }

  activarEdicion() {
    if (!this.historial) return;
    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
    this.precargarForm(this.historial);
  }

  cancelarEdicion() {
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';
    if (this.historial) this.precargarForm(this.historial);
  }

  volver() {
    this.router.navigate(['/list-historiales']);
  }

  // ===== Helpers UI =====
  animalLabelById(idAnimal: number | null | undefined): string {
    if (!idAnimal) return '-';
    const a = this.animalesVM.find(x => x.idAnimal === Number(idAnimal));
    return a?.label || `Animal ${idAnimal}`;
  }

  guardarCambios() {
    if (!this.historial) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    if (!this.form.idAnimal) {
      this.saving = false;
      this.errorMsg = 'Debes seleccionar un animal.';
      return;
    }

    const dto: UpdateHistorialDto = {
      estado: this.form.estado,
      idAnimal: Number(this.form.idAnimal),
    };

    this.historialService.updateHistorial(this.idHistorial, dto).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Historial actualizado correctamente.';
        this.editMode = false;

        // recargar para ver los datos actualizados
        this.historialService.getHistorialById(this.idHistorial, false).subscribe({
          next: (h) => {
            this.historial = h;
            this.precargarForm(h);
          },
          error: () => {}
        });
      },
      error: (err) => {
        this.saving = false;
        const msg = err?.error?.message || 'Error guardando cambios.';
        // por si choca con unique idAnimal en Historial (un animal solo puede tener un historial)
        this.errorMsg = msg.includes('unique') || msg.includes('UNIQUE')
          ? 'Ese animal ya tiene un historial creado. Selecciona otro.'
          : msg;
      }
    });
  }
}
