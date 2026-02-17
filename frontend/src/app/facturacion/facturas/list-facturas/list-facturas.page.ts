import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FacturaService, Factura, FormaPago } from '../../../services/factura.service';
import { UsuarioService, Usuario } from '../../../services/usuario.service';

import { PermisosService } from 'src/app/seguridad/permisos.service';

type FormaPagoFiltro = FormaPago | 'todos';

interface FacturaVM {
  idFactura: number;
  fechaCreacion: string;
  estado: string;
  total: number;
  formaPago?: string | null;

  idUsuario_pagador: number;
  pagadorNombre: string; // "id - nombre apellidos"
}

@Component({
  selector: 'app-list-facturas',
  templateUrl: './list-facturas.page.html',
  styleUrls: ['./list-facturas.page.scss'],
  standalone: false,
})
export class ListFacturasPage {

  facturas: Factura[] = [];
  facturasFiltradas: FacturaVM[] = [];
  facturasVM: FacturaVM[] = [];

  usuarios: Usuario[] = [];

  // filtro
  filtroFormaPago: FormaPagoFiltro = 'todos';
  filtroTexto = '';

  formasPago: FormaPago[] = ['efectivo', 'tarjeta', 'bizum', 'transferencia'];

  loading = false;
  errorMsg = '';

  constructor(
    private facturaService: FacturaService,
    private usuarioService: UsuarioService,
    private router: Router,
    private permisos: PermisosService
  ) {}

  get canNuevo(): boolean {
    return this.permisos.can('facturas', 'nuevo');
  }

  get canVer(): boolean {
    return this.permisos.can('facturas', 'ver');
  }

  // ✅ ahora es por factura (condicional por estado)
  canEliminar(vm: FacturaVM): boolean {
    return this.permisos.can('facturas', 'eliminar', {
      estadoFactura: vm.estado
    });
  }

  ionViewWillEnter() {
    this.cargarTodo();
  }

  private cargarTodo() {
    this.loading = true;
    this.errorMsg = '';

    // 1) usuarios
    this.usuarioService.getUsuarios().subscribe({
      next: (u) => {
        this.usuarios = u || [];
        // 2) facturas
        this.cargarFacturas();
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando usuarios';
      }
    });
  }

  private cargarFacturas() {
    this.facturaService.getFacturas().subscribe({
      next: (data) => {
        this.facturas = data || [];

        // ViewModel (para mostrar nombre+apellidos del pagador)
        this.facturasVM = this.facturas.map(f => ({
          idFactura: f.idFactura,
          fechaCreacion: f.fechaCreacion,
          estado: f.estado,
          total: Number(f.total ?? 0),
          formaPago: f.formaPago ?? null,
          idUsuario_pagador: f.idUsuario_pagador,
          pagadorNombre: this.labelUsuario(f.idUsuario_pagador),
        }));

        // ordenar por id desc
        this.facturasVM.sort((a, b) => (b.idFactura ?? 0) - (a.idFactura ?? 0));

        this.aplicarFiltros();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err?.error?.message || 'Error cargando facturas';
      }
    });
  }

  aplicarFiltros() {
    const q = (this.filtroTexto || '').toLowerCase().trim();

    this.facturasFiltradas = this.facturasVM.filter(f => {
      const coincideFormaPago =
        this.filtroFormaPago === 'todos'
          ? true
          : (f.formaPago || '') === this.filtroFormaPago;

      const texto = `
        ${f.pagadorNombre}
        ${f.fechaCreacion}
        ${f.estado}
        ${f.total}
        ${f.formaPago || ''}
        ${f.idFactura}
      `.toLowerCase();

      const coincideTexto = q === '' ? true : texto.includes(q);

      return coincideFormaPago && coincideTexto;
    });
  }

  limpiarFiltros() {
    this.filtroFormaPago = 'todos';
    this.filtroTexto = '';
    this.aplicarFiltros();
  }

  labelUsuario(idUsuario: number): string {
    const u = this.usuarios.find(x => x.idUsuario === idUsuario);
    if (!u) return `${idUsuario} - (sin datos)`;
    const nombre = `${u.nombre || ''} ${u.apellidos || ''}`.trim();
    return `${u.idUsuario} - ${nombre || '(sin nombre)'}`;
  }

  crearFactura() {
    this.router.navigate(['/form-facturas']);
  }

  verDetalle(vm: FacturaVM) {
    this.router.navigate(['/edit-facturas', vm.idFactura]);
  }

  eliminarFactura(vm: FacturaVM) {
    if (!confirm(`¿Seguro que quieres eliminar la factura ID ${vm.idFactura}?\n\nSe eliminarán también sus líneas.`)) return;

    this.facturaService.deleteFactura(vm.idFactura).subscribe({
      next: () => this.cargarTodo(),
      error: (err) => alert(err?.error?.message || 'Error eliminando factura')
    });
  }

  verLineas(vm: FacturaVM) {
    this.router.navigate(['/list-lineas-facturas'], {
      queryParams: { idFactura: vm.idFactura }
    });
  }

  // helpers visuales
  formatFecha(iso: string): string {
    if (!iso) return '-';
    return iso.substring(0, 10);
  }

  formatMoney(value: any): string {
    const n = Number(value);
    if (Number.isNaN(n)) return '-';
    return n.toFixed(2);
  }
    volver() {
    this.router.navigate(['/menu']);  
  }

}
