import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import {
  FacturaService,
  CreateFacturaDto,
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
  selector: 'app-form-facturas',
  templateUrl: './form-facturas.page.html',
  styleUrls: ['./form-facturas.page.scss'],
  standalone: false,
})
export class FormFacturasPage {
  loading = false;
  errorMsg = '';
  okMsg = '';

  usuarios: UsuarioSelect[] = [];

  estados: EstadoFactura[] = ['Creada', 'Emitida', 'Pagada', 'cancelada'];
  formasPago: FormaPago[] = ['efectivo', 'tarjeta', 'bizum', 'transferencia'];

  form = {
    idUsuario_pagador: null as number | null,

    descPct: 0,
    impuestoPct: 7,

    estado: 'Creada' as EstadoFactura,
    formaPago: 'efectivo' as FormaPago,
  };

  // datos auto
  private idUsuario_emisor!: number;

  // n_factura autogenerado
  nFacturaAuto = '';

  constructor(
    private router: Router,
    private auth: AuthService,
    private facturaService: FacturaService,
    private permisos: PermisosService

  ) {}

get canNuevo(): boolean {
  return this.permisos.can('facturas', 'nuevo');
}



  ionViewWillEnter() {

    if (!this.canNuevo) {
  this.router.navigate(['/menu']);
  return;
}


    const user = this.auth.getUser();
    this.idUsuario_emisor = Number(user?.idUsuario);

    if (!this.idUsuario_emisor) {
      this.errorMsg = 'No se pudo obtener el usuario logueado. Inicia sesión de nuevo.';
      return;
    }

    // generar nº factura al entrar (y se puede regenerar si quieres con un botón)
    this.nFacturaAuto = this.generarNumeroFactura();

    this.cargarUsuarios();
  }

  private pad2(n: number) {
    return String(n).padStart(2, '0');
  }

  private pad3(n: number) {
    return String(n).padStart(3, '0');
  }

  /** Ej: FAC-20260214-153025-128  (YYYYMMDD-HHMMSS-ms) */
  private generarNumeroFactura(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = this.pad2(d.getMonth() + 1);
    const dd = this.pad2(d.getDate());
    const hh = this.pad2(d.getHours());
    const mi = this.pad2(d.getMinutes());
    const ss = this.pad2(d.getSeconds());
    const ms = this.pad3(d.getMilliseconds());
    return `FAC-${yyyy}${mm}${dd}-${hh}${mi}${ss}-${ms}`;
  }

  cargarUsuarios() {
    this.loading = true;
    this.errorMsg = '';
    this.okMsg = '';

    this.auth.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = (data || []).map((u: any) => ({
          idUsuario: Number(u.idUsuario),
          dni: u.dni ?? u.DNI ?? u.nif ?? null,
          nombre: u.nombre ?? '',
          apellidos: u.apellidos ?? '',
          email: u.email ?? ''
        }));
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios.';
      }
    });
  }

  userLabel(u: UsuarioSelect) {
    const dni = (u.dni || '').toString().trim();
    const nom = `${u.nombre ?? ''} ${u.apellidos ?? ''}`.trim();
    return `${dni ? dni + ' - ' : ''}${u.idUsuario} - ${nom}`;
  }

  guardar() {
    this.errorMsg = '';
    this.okMsg = '';

    if (!this.idUsuario_emisor) {
      this.errorMsg = 'Usuario emisor no válido.';
      return;
    }

    if (!this.form.idUsuario_pagador) {
      this.errorMsg = 'Debes seleccionar un pagador.';
      return;
    }

    const descPct = Number(this.form.descPct ?? 0);
    const impPct = Number(this.form.impuestoPct ?? 7);

    if (!Number.isFinite(descPct) || descPct < 0 || descPct > 100) {
      this.errorMsg = 'descPct debe estar entre 0 y 100.';
      return;
    }

    if (!Number.isFinite(impPct) || impPct < 0 || impPct > 100) {
      this.errorMsg = 'impuestoPct debe estar entre 0 y 100.';
      return;
    }

    // por seguridad, si el usuario tardó mucho en rellenar, puedes regenerarlo al guardar:
    // this.nFacturaAuto = this.generarNumeroFactura();

    this.loading = true;

    const dto: CreateFacturaDto = {
      fechaCreacion: new Date().toISOString(),

      // NO enviar FechaPago al crear
      descPct: descPct,
      impuestoPct: impPct,

      estado: this.form.estado,
      formaPago: this.form.formaPago,

      n_factura: this.nFacturaAuto,
      idUsuario_pagador: Number(this.form.idUsuario_pagador),
      idUsuario_emisor: this.idUsuario_emisor
    };

    this.facturaService.createFactura(dto).subscribe({
      next: (f) => {
        this.loading = false;
        this.okMsg = 'Factura creada correctamente. Ahora puedes añadir líneas.';
        this.router.navigate(['/list-lineas-facturas'], {
          queryParams: { idFactura: f.idFactura }
        });
      },
      error: (err) => {
        this.loading = false;

        // si por lo que sea choca el UNIQUE (muy raro), regeneramos y avisamos
        const msg = err?.error?.message || 'Error creando factura.';
        this.errorMsg = msg.includes('unique') || msg.includes('UNIQUE')
          ? 'El número de factura ya existe. Vuelve a intentar (se generará uno nuevo).'
          : msg;

        // opcional: regenerar para siguiente intento
        this.nFacturaAuto = this.generarNumeroFactura();
      }
    });
  }

  cancelar() {
    this.router.navigate(['/list-facturas']);
  }
}
