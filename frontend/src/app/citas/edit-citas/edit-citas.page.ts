import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CitaService, Cita, UpdateCitaDto } from '../../services/cita.service';
import { AnimalService, Animal } from '../../services/animal.service';
import { UsuarioService, Usuario } from '../../services/usuario.service';

import { AuthService } from '../../services/auth.service';
import { PermisosService } from 'src/app/seguridad/permisos.service';

@Component({
  selector: 'app-edit-citas',
  templateUrl: './edit-citas.page.html',
  styleUrls: ['./edit-citas.page.scss'],
  standalone: false,
})
export class EditCitasPage {
  idCita!: number;

  cita: Cita | null = null;

  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';

  editMode = false;

  // datos para desplegables
  usuarios: Usuario[] = [];
  usuariosById = new Map<number, Usuario>();
  veterinarios: Usuario[] = [];
  programadores: Usuario[] = [];
  animales: Animal[] = [];

  estados: Array<Cita['estado']> = ['pendiente', 'confirmada', 'atendida', 'cancelada'];

  // formulario para update
  form: UpdateCitaDto = {
    fecha: '',
    HoraIni: '',
    HoraFin: '',
    estado: 'pendiente',
    motivo: '',
    notas: '',
    idAnimal: null as any,
    idUsuario_programa: null as any,
    idUsuario_atiende: null as any,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private citaService: CitaService,
    private animalService: AnimalService,
    private usuarioService: UsuarioService,
    private auth: AuthService,
    private permisos: PermisosService
  ) {}

  // =========================
  // Permisos
  // =========================
  
  get canVer(): boolean {
    return this.permisos.can('citas', 'ver');
  }

  // ✅ EDITAR contextual: para recepcionista bloquea si atendida (y vet/cliente nunca)
  get canEditar(): boolean {
    return this.permisos.can('citas', 'editar', { estadoCita: this.cita?.estado });
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

    this.idCita = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.idCita) {
      this.errorMsg = 'ID de cita inválido.';
      return;
    }

    this.cargarDatosBase();
  }

  private cargarDatosBase() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    // 1) usuarios
    this.usuarioService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = users || [];
        this.usuariosById = new Map<number, Usuario>();
        (users || []).forEach(u => this.usuariosById.set(u.idUsuario, u));

        this.veterinarios = (users || []).filter(u => u.rol === 'veterinario');
        this.programadores = (users || []).filter(u => u.rol === 'administrador' || u.rol === 'recepcionista');

        // 2) animales
        this.animalService.getAnimales().subscribe({
          next: (anis) => {
            this.animales = anis || [];

            // 3) cita
            this.cargarCita();
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

  private cargarCita() {
    this.citaService.getCitaById(this.idCita).subscribe({
      next: (data) => {
        this.cita = data;

        // ✅ Seguridad extra: si es cliente, solo puede ver sus citas
        if (this.isCliente) {
          const idAnimal = Number(data.idAnimal ?? 0);
          const a = this.animales.find(x => Number(x.idAnimal) === idAnimal);

            if (!a) {
    this.router.navigate(['/menu']);
    return;
  }

          const idDueno = Number((a as any)?.idUsuario ?? 0);

          if (!idDueno || idDueno !== this.idUsuarioLogueado) {
            this.router.navigate(['/menu']);
            return;
          }
        }

        this.form = {
          fecha: data.fecha ?? '',
          HoraIni: data.HoraIni ?? '',
          HoraFin: data.HoraFin ?? '',
          estado: data.estado,
          motivo: (data.motivo ?? '') as any,
          notas: (data.notas ?? '') as any,
          idAnimal: data.idAnimal as any,
          idUsuario_programa: data.idUsuario_programa as any,
          idUsuario_atiende: data.idUsuario_atiende as any,
        };

        // ✅ si no tiene permiso de editar, jamás dejar editMode activo
        if (!this.canEditar) {
          this.editMode = false;
        }

        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando cita';
      }
    });
  }

  activarEdicion() {
    if (!this.cita) return;

    // ✅ bloqueo adicional por si se llama desde código
    if (!this.canEditar) return;

    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
  }

  cancelarEdicion() {
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';

    if (this.cita) {
      this.form = {
        fecha: this.cita.fecha ?? '',
        HoraIni: this.cita.HoraIni ?? '',
        HoraFin: this.cita.HoraFin ?? '',
        estado: this.cita.estado,
        motivo: (this.cita.motivo ?? '') as any,
        notas: (this.cita.notas ?? '') as any,
        idAnimal: this.cita.idAnimal as any,
        idUsuario_programa: this.cita.idUsuario_programa as any,
        idUsuario_atiende: this.cita.idUsuario_atiende as any,
      };
    }
  }

  guardarCambios() {
    if (!this.cita) return;

    // ✅ seguridad: no permitir update si no puede editar
    if (!this.canEditar) return;

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    const payload: UpdateCitaDto = {
      ...this.form,
      motivo: (this.form.motivo ?? '').toString().trim() || null,
      notas: (this.form.notas ?? '').toString().trim() || null,
    };

    this.citaService.updateCita(this.idCita, payload).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Cita actualizada correctamente';
        this.editMode = false;
        this.cargarCita();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error guardando cambios';
      }
    });
  }

  volver() {
    this.router.navigate(['/list-citas']);
  }

  // ---------- Labels para UI ----------
  userLabelById(id: number | null | undefined): string {
    if (!id) return '-';
    const u = this.usuariosById.get(id);
    if (!u) return `${id}`;
    return `${u.idUsuario} - ${u.nombre}${u.apellidos ? ' ' + u.apellidos : ''}`.trim();
  }

  animalLabelById(idAnimal: number | null | undefined): string {
    if (!idAnimal) return '-';
    const a = this.animales.find(x => x.idAnimal === idAnimal);
    if (!a) return `${idAnimal}`;
    const dueno = this.usuariosById.get(a.idUsuario);
    const duenoNombre = dueno
      ? `${dueno.nombre}${dueno.apellidos ? ' ' + dueno.apellidos : ''}`.trim()
      : `idUsuario ${a.idUsuario}`;
    return `${a.idAnimal} - ${a.nombre} (Dueño: ${duenoNombre})`;
  }

  animalOptionLabel(a: Animal): string {
    const dueno = this.usuariosById.get(a.idUsuario);
    const duenoNombre = dueno
      ? `${dueno.nombre}${dueno.apellidos ? ' ' + dueno.apellidos : ''}`.trim()
      : `idUsuario ${a.idUsuario}`;
    return `${a.idAnimal} - ${a.nombre} (Dueño: ${duenoNombre})`;
  }

  userOptionLabel(u: Usuario): string {
    return `${u.idUsuario} - ${u.nombre}${u.apellidos ? ' ' + u.apellidos : ''}`.trim();
  }
}
