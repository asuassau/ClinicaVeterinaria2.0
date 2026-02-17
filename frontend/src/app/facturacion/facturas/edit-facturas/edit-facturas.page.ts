import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import {
  FacturaService,
  Factura,
  UpdateFacturaDto,
  EstadoFactura,
  FormaPago
} from 'src/app/services/factura.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';

interface UsuarioSelect {
  idUsuario: number;
  dni?: string;
  nombre?: string;
  apellidos?: string;
  email?: string;
}

@Component({
  selector: 'app-edit-facturas',
  templateUrl: './edit-facturas.page.html',
  styleUrls: ['./edit-facturas.page.scss'],
  standalone: false,
})
export class EditFacturasPage {
  loading = false;
  saving = false;
  errorMsg = '';
  okMsg = '';

  editMode = false;

  factura: Factura | null = null;
  usuarios: UsuarioSelect[] = [];

  estados: EstadoFactura[] = ['Creada', 'Emitida', 'Pagada', 'cancelada'];
  formasPago: FormaPago[] = ['efectivo', 'tarjeta', 'bizum', 'transferencia'];

  form: {
    descPct: number;
    impuestoPct: number;
    estado: EstadoFactura;
    formaPago: FormaPago | null;
    idUsuario_pagador: number | null;
  } = {
    descPct: 0,
    impuestoPct: 7,
    estado: 'Creada',
    formaPago: 'efectivo',
    idUsuario_pagador: null,
  };

  private idFactura!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: FacturaService,
    private auth: AuthService,
    private permisos: PermisosService
  ) {}

  // ---- Permisos base ----
  get canVer(): boolean {
    return this.permisos.can('facturas', 'ver');
  }

  /**
   * Permiso de edición con contexto (estadoFactura).
   * Aunque ahora mismo tu permisos.ts para facturas no depende del estado,
   * esto deja el código preparado para reglas condicionales por estado.
   */
  get canEditarFactura(): boolean {
    return this.permisos.can('facturas', 'editar', {
      estadoFactura: this.factura?.estado
    });
  }

  ionViewWillEnter() {
    if (!this.canVer) {
      this.router.navigate(['/menu']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    this.idFactura = Number(id);

    if (!this.idFactura) {
      this.errorMsg = 'ID de factura inválido.';
      return;
    }

    this.cargarUsuariosYFactura();
  }

  get isPagada(): boolean {
    return this.factura?.estado === 'Pagada';
  }

  cargarUsuariosYFactura() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    // Usuarios (para mostrar labels y selector de pagador)
    this.auth.getUsuarios().subscribe({
      next: (uData: any) => {
        this.usuarios = (uData || []).map((u: any) => ({
          idUsuario: Number(u.idUsuario),
          dni: u.dni ?? u.DNI ?? u.nif ?? u.NIF ?? null,
          nombre: u.nombre ?? '',
          apellidos: u.apellidos ?? '',
          email: u.email ?? ''
        }));

        this.facturaService.getFacturaById(this.idFactura, true).subscribe({
          next: (f) => {
            this.factura = f;
            this.precargarForm(f);
            this.loading = false;

            // Si alguien entra aquí sin permiso real de edición, forzamos modo vista
            if (!this.canEditarFactura) this.editMode = false;
          },
          error: (err) => {
            this.loading = false;
            this.errorMsg = err?.error?.message || 'Error cargando factura.';
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios.';
      }
    });
  }

  activarEdicion() {
    if (!this.factura) return;

    if (!this.canEditarFactura) {
      this.errorMsg = 'No tienes permisos para editar facturas.';
      this.okMsg = '';
      this.editMode = false;
      return;
    }

    this.editMode = true;
    this.okMsg = '';
    this.errorMsg = '';
    this.precargarForm(this.factura);
  }

  cancelarEdicion() {
    this.editMode = false;
    this.okMsg = '';
    this.errorMsg = '';
    if (this.factura) this.precargarForm(this.factura);
  }

  volver() {
    this.router.navigate(['/list-facturas']);
  }

  private precargarForm(f: Factura) {
    this.form = {
      descPct: Number(f.descPct ?? 0),
      impuestoPct: Number(f.impuestoPct ?? 7),
      estado: f.estado,
      formaPago: (f.formaPago ?? 'efectivo') as FormaPago,
      idUsuario_pagador: f.idUsuario_pagador ? Number(f.idUsuario_pagador) : null,
    };
  }

  // ====== Labels de usuario ======
  private userFromList(idUsuario: number | null | undefined): UsuarioSelect | null {
    if (!idUsuario) return null;
    return this.usuarios.find(u => u.idUsuario === Number(idUsuario)) || null;
  }

  userLabelById(idUsuario: number | null | undefined): string {
    const u = this.userFromList(idUsuario);
    if (!u) return '-';
    const dni = (u.dni || '').toString().trim();
    const nom = `${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
    return `${dni ? dni + ' - ' : ''}${nom || ('ID ' + u.idUsuario)}`;
  }

  userOptionLabel(u: UsuarioSelect): string {
    const dni = (u.dni || '').toString().trim();
    const nom = `${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
    return `${dni ? dni + ' - ' : ''}${u.idUsuario} - ${nom}`;
  }

  // ====== Formato fecha/hora ======
  fechaSolo(iso?: string | null): string {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  horaSolo(iso?: string | null): string {
    if (!iso) return '-';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '-';
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mi}`;
  }

  guardarCambios() {
    if (!this.factura) return;

    if (!this.canEditarFactura) {
      this.errorMsg = 'No tienes permisos para editar facturas.';
      this.okMsg = '';
      this.editMode = false;
      return;
    }

    this.saving = true;
    this.errorMsg = '';
    this.okMsg = '';

    // Regla: no permitir pasar a Pagada sin pagador
    if (this.form.estado === 'Pagada' && !this.form.idUsuario_pagador) {
      this.saving = false;
      this.errorMsg = 'No puedes marcar como Pagada sin seleccionar un pagador.';
      return;
    }

    const dto: UpdateFacturaDto & { idUsuario_pagador?: number; FechaPago?: string } = {
      estado: this.form.estado,
      formaPago: this.isPagada ? undefined : (this.form.formaPago ?? null),
      descPct: this.isPagada ? undefined : Number(this.form.descPct ?? 0),
      impuestoPct: this.isPagada ? undefined : Number(this.form.impuestoPct ?? 7),
    };

    // Pagador: editable si NO está pagada
    if (!this.isPagada) {
      dto.idUsuario_pagador = Number(this.form.idUsuario_pagador);
    }

    // FechaPago automática al cambiar a Pagada
    const before = this.factura.estado;
    const alreadyHasFechaPago = !!this.factura.FechaPago;

    if (before !== 'Pagada' && this.form.estado === 'Pagada' && !alreadyHasFechaPago) {
      dto.FechaPago = new Date().toISOString();
    }

    // limpiar undefined
    Object.keys(dto).forEach((k) => {
      const key = k as keyof typeof dto;
      if (dto[key] === undefined) delete dto[key];
    });

    this.facturaService.updateFactura(this.idFactura, dto).subscribe({
      next: () => {
        this.saving = false;
        this.okMsg = 'Factura actualizada correctamente.';
        this.editMode = false;

        this.facturaService.getFacturaById(this.idFactura, true).subscribe({
          next: (f) => {
            this.factura = f;
            this.precargarForm(f);
          },
          error: () => {}
        });
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = err?.error?.message || 'Error guardando cambios.';
      }
    });
  }
}
