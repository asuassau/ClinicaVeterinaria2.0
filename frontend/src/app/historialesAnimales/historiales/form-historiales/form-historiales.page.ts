import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { HistorialService, CreateHistorialDto } from 'src/app/services/historial.service';
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
  selector: 'app-form-historiales',
  templateUrl: './form-historiales.page.html',
  styleUrls: ['./form-historiales.page.scss'],
  standalone: false,
})
export class FormHistorialesPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  animalesVM: AnimalSelectVM[] = [];

  form = {
    idAnimal: null as number | null
  };

  constructor(
    private router: Router,
    private historialService: HistorialService,
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private permisos: PermisosService
  ) {}

  get canNuevo(): boolean {
    return this.permisos.can('historiales', 'nuevo');
  }

  ionViewWillEnter() {

    if (!this.canNuevo) {
  this.router.navigate(['/menu']);
  return;
}

    this.cargarAnimalesConDueno();
  }

  private cargarAnimalesConDueno() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    // 1) usuarios -> 2) animales -> construir labels
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.animalService.getAnimales().subscribe({
          next: (animales) => {
            const uList: Usuario[] = usuarios || [];
            const aList: Animal[] = animales || [];

            const vms: AnimalSelectVM[] = aList.map((a: any) => {
              const idDueno = Number(a?.idUsuario ?? 0);

              const dueno: any = uList.find((u: any) => Number(u.idUsuario) === idDueno);

              const nif = (dueno?.nif ?? dueno?.dni ?? dueno?.NIF ?? dueno?.DNI ?? '').toString().trim();
              const nombre = `${dueno?.nombre ?? ''} ${dueno?.apellidos ?? ''}`.trim();

              const animalNombre = (a?.nombre ?? '').toString().trim() || `(Animal ${a?.idAnimal})`;

              const label = `${animalNombre} - ${nif ? nif : idDueno} ${nombre ? '+ ' + nombre : ''}`.trim();

              return {
                idAnimal: Number(a.idAnimal),
                animalNombre,
                idDueno,
                duenoNif: nif,
                duenoNombreCompleto: nombre,
                label
              };
            });

            // Ordenar por nombre animal (y luego id)
            vms.sort((x, y) => {
              const a = (x.animalNombre || '').localeCompare(y.animalNombre || '');
              return a !== 0 ? a : (x.idAnimal - y.idAnimal);
            });

            this.animalesVM = vms;
            this.loading = false;
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

  private hoyYYYYMMDD(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';

    if (!this.form.idAnimal) {
      this.errorMsg = 'Debes seleccionar un animal.';
      return;
    }

    this.loading = true;

    const dto: CreateHistorialDto = {
      fechaAlta: this.hoyYYYYMMDD(), // DATEONLY
      estado: 'Activo',
      idAnimal: Number(this.form.idAnimal),
    };

    this.historialService.createHistorial(dto).subscribe({
      next: (h) => {
        this.loading = false;
        this.okMsg = 'Historial creado correctamente.';
        // ir al listado o al detalle; aquí vuelvo al listado
        this.router.navigate(['/list-historiales']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || 'Error creando historial.';
        // Si choca con UNIQUE idAnimal (ya tiene historial)
        this.errorMsg = msg.includes('unique') || msg.includes('UNIQUE')
          ? 'Ese animal ya tiene un historial creado.'
          : msg;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-historiales']);
  }
}
