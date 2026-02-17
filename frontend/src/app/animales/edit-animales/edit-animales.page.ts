import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Animal, AnimalService, UpdateAnimalDto } from '../../services/animal.service';
import { Usuario, UsuarioService } from '../../services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';
import { AuthService } from 'src/app/services/auth.service';

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

  usuarios: Usuario[] = [];
  usuariosMap = new Map<number, Usuario>();

  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';
  editMode = false;

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
    private usuarioService: UsuarioService,
    private permisos: PermisosService,
    private auth: AuthService
  ) {}

  /* ================== PERMISOS ================== */

get canEditar(): boolean {
  if (this.isCliente) {
    // cliente: editar permitido solo si propietario (y luego en guardarCambios limitas a foto)
    return this.permisos.can('animales', 'editar', { esPropietario: this.isPropietarioAnimal });
  }
  return this.permisos.can('animales', 'editar');
}

get canVer(): boolean {
  if (this.isCliente) {
    // solo si es propietario (cuando ya cargaste el animal)
    return this.permisos.can('animales', 'ver', { esPropietario: this.isPropietarioAnimal });
  }
  return this.permisos.can('animales', 'ver');
}

  get isCliente(): boolean {
    return (this.auth.getUserRole() || '') === 'cliente';
  }

  get idUsuarioLogueado(): number {
    return Number(this.auth.getUser()?.idUsuario ?? 0);
  }

  ionViewWillEnter() {

  if (!this.isCliente && !this.canVer) {
    this.router.navigate(['/menu']);
    return;
  }

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

    this.usuarioService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = users ?? [];
        this.usuariosMap = new Map(this.usuarios.map(u => [u.idUsuario, u]));
        this.cargarAnimal();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios.';
      }
    });
  }

  private cargarAnimal() {
    this.animalService.getAnimalById(this.idAnimal).subscribe({
      next: (a) => {

        // 🔒 CLIENTE solo puede ver su propio animal
        if (this.isCliente && Number(a.idUsuario) !== this.idUsuarioLogueado) {
          this.router.navigate(['/menu']);
          return;
        }

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
      sexo: this.animal.sexo ?? null,
      observaciones: this.animal.observaciones ?? '',
      foto: this.animal.foto ?? '',
      idUsuario: this.animal.idUsuario ?? undefined,
    };
  }

  ownerLabelById(idUsuario: number | null | undefined): string {
    if (!idUsuario) return '-';
    const u = this.usuariosMap.get(idUsuario);
    if (!u) return `${idUsuario}`;
    return `${u.idUsuario} - ${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
  }

  activarEdicion() {
    if (!this.canEditar) return;
    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
  }

  cancelarEdicion() {
    this.editMode = false;
    this.rellenarFormDesdeAnimal();
  }

  guardarCambios() {
    if (!this.animal) return;

    this.saving = true;

    let payload: UpdateAnimalDto;

    // 🔒 CLIENTE solo puede modificar FOTO
    if (this.isCliente) {
      payload = {
        foto: this.form.foto?.trim() || null
      };
    } else {
      payload = {
        ...this.form,
        Fechanac: this.form.Fechanac || null,
        sexo: this.form.sexo || null,
        raza: this.form.raza?.trim() || null,
        observaciones: this.form.observaciones?.trim() || null,
        foto: this.form.foto?.trim() || null,
      };
    }

    this.animalService.updateAnimal(this.idAnimal, payload).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Animal actualizado correctamente.';
        this.editMode = false;
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
private get isPropietarioAnimal(): boolean {
  if (!this.isCliente) return false;
  return !!this.animal && Number(this.animal.idUsuario) === this.idUsuarioLogueado;
}


}
