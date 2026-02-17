export type Role = 'administrador' | 'veterinario' | 'recepcionista' | 'cliente';

export type Recurso =
  | 'usuarios'
  | 'citas'
  | 'historiales'
  | 'lineasHistorial'
  | 'facturas'
  | 'lineasFactura'
  | 'servicios'
  | 'productos'
  | 'animales';

export type Accion = 'ver' | 'nuevo' | 'editar' | 'eliminar';

/**
 * Campos editables por recurso (para restricciones tipo "no puede editar rol", etc.)
 */
export type Field =
  | 'usuarios.rol'
  | 'productos.nombre'
  | 'productos.precio'
  | 'productos.tipo'
  | 'productos.descripcion'
  | 'productos.stockMinimo'
  | 'productos.stock'
  | 'productos.foto'
  | 'animales.foto'
  | 'animales.general';

export interface Ctx {
  esCliente?: boolean;
  esPropietario?: boolean;
  estadoFactura?: string; // 'Creada'|'Emitida'|'Pagada'|'cancelada'...
  estadoCita?: string;    // 'pendiente'|'confirmada'|'atendida'|'cancelada'
}

function norm(s: any): string {
  return String(s ?? '').trim().toLowerCase();
}

function esCerrada(ctx: Ctx): boolean {
  // “cerrada” = Pagada (según tu criterio)
  return norm(ctx.estadoFactura) === 'pagada';
}

function citaAtendida(ctx: Ctx): boolean {
  // ✅ backend enum usa 'atendida' en minúscula
  return norm(ctx.estadoCita) === 'atendida';
}

/**
 * Permiso por ACCIÓN (botones: ver/nuevo/editar/eliminar)
 */
export function can(role: Role, recurso: Recurso, accion: Accion, ctx: Ctx = {}): boolean {
  // ADMIN: todo
  if (role === 'administrador') return true;

  // =========================
  // RECEPCIONISTA
  // =========================
  if (role === 'recepcionista') {
    switch (recurso) {
      case 'usuarios':
        // CRUD solo clientes
        if (accion === 'ver') return true;
        if (accion === 'eliminar') return false;
        return !!ctx.esCliente;

      case 'citas':
        if (accion === 'ver') return true;
        if (accion === 'nuevo') return true;
        if (accion === 'editar') return !citaAtendida(ctx);
        if (accion === 'eliminar') return false; // nunca elimina citas
        return false;

      case 'historiales':
      case 'lineasHistorial':
        // solo ver
        return accion === 'ver';

      case 'facturas':
        if (accion === 'ver') return true;
        if (accion === 'nuevo') return true;

        // ✅ editar SOLO si NO está Pagada
        if (accion === 'editar') return !esCerrada(ctx);

        // ✅ NO eliminar nunca
        if (accion === 'eliminar') return false;

        return false;

      case 'lineasFactura':
        if (accion === 'ver') return true;

        // ✅ nuevo/editar/eliminar SOLO si NO está Pagada
        // (confirmado por ti: puede eliminar si no está pagada)
        if (accion === 'nuevo' || accion === 'editar' || accion === 'eliminar') return !esCerrada(ctx);

        return false;

      case 'servicios':
        // solo ver
        return accion === 'ver';

      case 'productos':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'eliminar') return false;
        if (accion === 'editar') return true; // limitado por canField
        return false;

      case 'animales':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'editar') return true;
        if (accion === 'eliminar') return false;
        return false;
    }
  }

  // =========================
  // VETERINARIO
  // =========================
  if (role === 'veterinario') {
    switch (recurso) {
      case 'usuarios':
        // CRUD solo clientes
        if (accion === 'ver') return true;
        if (accion === 'eliminar') return false;
        return !!ctx.esCliente;

      case 'citas':
        // solo ver
        return accion === 'ver';

      case 'historiales':
      case 'lineasHistorial':
        // puede ver/nuevo/editar pero NO eliminar
        if (accion === 'ver' || accion === 'nuevo' || accion === 'editar') return true;
        if (accion === 'eliminar') return false;
        return false;

      case 'facturas':
        // solo ver
        return accion === 'ver';

      case 'lineasFactura':
        if (accion === 'ver') return true;

        // ✅ NO eliminar nunca
        if (accion === 'eliminar') return false;

        // ✅ nuevo/editar SOLO si NO está Pagada
        if (accion === 'nuevo' || accion === 'editar') return !esCerrada(ctx);

        return false;

      case 'servicios':
        // solo ver
        return accion === 'ver';

      case 'productos':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'eliminar') return false;
        if (accion === 'editar') return true; // limitado por campo
        return false;

      case 'animales':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'editar') return true;
        if (accion === 'eliminar') return false;
        return false;
    }
  }

  // =========================
  // CLIENTE
  // =========================
  if (role === 'cliente') {
    switch (recurso) {
      case 'usuarios':
        // SOLO SU FICHA
        if (accion === 'ver' || accion === 'editar') return !!ctx.esPropietario;
        return false;

      case 'citas':
        // SOLO SUS CITAS (y solo ver)
        if (accion === 'ver') return true;
        return false;

      case 'animales':
        // SOLO SUS ANIMALES (ver) y editar (foto) controlado en canField
        if (accion === 'ver') return !!ctx.esPropietario;
        if (accion === 'editar') return !!ctx.esPropietario;
        return false;

      default:
        return false;
    }
  }

  return false;
}

/**
 * Permisos POR CAMPO (bloquear inputs concretos)
 */
export function canField(role: Role, field: Field, accion: Accion, ctx: Ctx = {}): boolean {
  // admin: todo
  if (role === 'administrador') return true;

  if (accion !== 'editar') return true;

  // -------- USUARIOS --------
  if (field === 'usuarios.rol') {
    // Veterinario/Recepcionista/Cliente: nunca puede editar rol
    return false;
  }

  // -------- PRODUCTOS --------
  if (field.startsWith('productos.')) {
    // Recepcionista y Veterinario: solo pueden editar foto y stock
    if (role === 'recepcionista' || role === 'veterinario') {
      return field === 'productos.foto' || field === 'productos.stock';
    }
    return false;
  }

  // -------- ANIMALES --------
  if (field.startsWith('animales.')) {
    if (role === 'cliente') {
      if (!ctx.esPropietario) return false;
      return field === 'animales.foto';
    }
    if (role === 'recepcionista' || role === 'veterinario') {
      return true;
    }
  }

  // ✅ fallback seguro
  return false;
}
