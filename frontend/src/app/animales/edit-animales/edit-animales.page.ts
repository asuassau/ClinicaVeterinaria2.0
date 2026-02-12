import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Animal, AnimalService, UpdateAnimalDto } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';

type Sexo = 'M' | 'H' | '';

@Component({
  selector: 'app-edit-animales',
  templateUrl: './edit-animales.page.html',
  styleUrls: ['./edit-animales.page.scss'],
  standalone: false,
})
export class EditAnimalesPage {
  idAnimal!: number;

  animal: Animal | null = null;

  // dueños para dropdown
  usuarios: Usuario[] = [];
  usuariosMap = new Map<number, Usuario>();

  // estados UI
  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';

  editMode = false;

  // form para edición
  form: UpdateAnimalDto = {
    nombre: '',
    especie: '',
    raza: '',
    Fechanac: null,
    sexo: null,
    observaciones: '',
    foto: '',
    idUsuario: undefined,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animalService: AnimalService,
    private usuarioService: UsuarioService
  ) {}

  ionViewWillEnter() {
    const rawId = this.route.snapshot.paramMap.get('id');
    this.idAnimal = rawId ? Number(rawId) : NaN;

    if (!this.idAnimal || Number.isNaN(this.idAnimal)) {
      this.errorMsg = 'ID de animal inválido.';
      return;
    }

    this.cargarUsuariosYAnimal();
  }

  private cargarUsuariosYAnimal() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    // 1) usuarios (para mostrar dueño y desplegable)
    this.usuarioService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = users ?? [];
        this.usuariosMap = new Map(this.usuarios.map(u => [u.idUsuario, u]));

        // 2) animal
        this.cargarAnimal();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios (dueños).';
      }
    });
  }

  private cargarAnimal() {
    this.animalService.getAnimalById(this.idAnimal).subscribe({
      next: (a) => {
        this.animal = a;
        this.rellenarFormDesdeAnimal();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando el animal.';
      }
    });
  }

  private rellenarFormDesdeAnimal() {
    if (!this.animal) return;

    this.form = {
      nombre: this.animal.nombre ?? '',
      especie: this.animal.especie ?? '',
      raza: this.animal.raza ?? '',
      Fechanac: this.animal.Fechanac ?? null,
      sexo: (this.animal.sexo ?? null) as ('M' | 'H' | null),
      observaciones: this.animal.observaciones ?? '',
      foto: this.animal.foto ?? '',
      idUsuario: this.animal.idUsuario ?? undefined,
    };
  }

  ownerLabelById(idUsuario: number | null | undefined): string {
    if (!idUsuario) return '-';
    const u = this.usuariosMap.get(idUsuario);
    if (!u) return `${idUsuario} - (desconocido)`;
    const fullName = `${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
    return `${u.idUsuario} - ${fullName || u.email || 'Usuario'}`;
  }

  activarEdicion() {
    this.okMsg = '';
    this.errorMsg = '';
    this.editMode = true;

    // aseguramos que el form está sincronizado
    this.rellenarFormDesdeAnimal();
  }

  cancelarEdicion() {
    this.okMsg = '';
    this.errorMsg = '';
    this.editMode = false;

    // reponer valores originales
    this.rellenarFormDesdeAnimal();
  }

  guardarCambios() {
    if (!this.animal) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    // Limpieza: si Fechanac viene vacía como '', la pasamos a null
    const payload: UpdateAnimalDto = {
      ...this.form,
      Fechanac: this.form.Fechanac ? this.form.Fechanac : null,
      sexo: (this.form.sexo as Sexo) ? (this.form.sexo as any) : null,
      raza: this.form.raza?.trim() || null,
      observaciones: this.form.observaciones?.trim() || null,
      foto: this.form.foto?.trim() || null,
    };

    this.animalService.updateAnimal(this.idAnimal, payload).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Animal actualizado correctamente.';
        this.editMode = false;
        // recarga detalle para reflejar cambios
        this.cargarAnimal();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error guardando cambios.';
      }
    });
  }

  volver() {
    this.router.navigate(['/list-animales']);
  }
}
