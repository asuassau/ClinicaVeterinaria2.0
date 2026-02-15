
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

// Contextos opcionales para reglas condicionales
export interface Ctx {
  estadoFactura?: string;     // 'Creada' | 'Emitida' | 'Pagada' | 'cancelada' | 'cerrada' ...
  estadoCita?: string;        // 'Atendida' ...
  esCliente?: boolean;        // para usuarios (rol=cliente)
  esPropietario?: boolean;    // para animales/citas/facturas del cliente
}

export function can(role: Role, recurso: Recurso, accion: Accion, ctx: Ctx = {}): boolean {
  // Admin: todo
  if (role === 'administrador') return true;

  // ===== RECEPCIONISTA =====
  if (role === 'recepcionista') {
    switch (recurso) {
      case 'usuarios':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'editar' || accion === 'eliminar') {
          // solo clientes
          return !!ctx.esCliente;
        }
        return false;

      case 'citas':
        if (accion === 'ver') return true;
        if (accion === 'nuevo') return true;
        if (accion === 'editar') {
          // no editar si está atendida
          return (ctx.estadoCita || '').toLowerCase() !== 'atendida';
        }
        if (accion === 'eliminar') return false;
        return false;

      case 'historiales':
      case 'lineasHistorial':
        // solo ver, sin nuevo/editar/eliminar
        return accion === 'ver';

      case 'facturas':
        if (accion === 'ver') return true;
        // según tu texto: “No puede eliminar” y además mencionas “solo cerrada”
        // como es contradictorio, aplico lo más seguro: NO eliminar nunca.
        if (accion === 'eliminar') return false;
        if (accion === 'nuevo' || accion === 'editar') return true; // crear/editar sí (salvo estado cerrado si quieres)
        return false;

      case 'lineasFactura':
        // crear/eliminar/editar solo si la factura está "cerrada" (según tu regla)
        // si en realidad era “solo si NO está cerrada”, invierte el boolean.
        const cerrada = (ctx.estadoFactura || '').toLowerCase() === 'cerrada';
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'editar' || accion === 'eliminar') return cerrada;
        return false;

      case 'servicios':
        return accion === 'ver'; // solo ver

      case 'productos':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'eliminar') return false;
        if (accion === 'editar') return true; // pero campos limitados (se controla en edit-productos)
        return false;

      case 'animales':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'editar') return true;
        if (accion === 'eliminar') return false;
        return false;
    }
  }

  // ===== VETERINARIO =====
  if (role === 'veterinario') {
    switch (recurso) {
      case 'usuarios':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'editar' || accion === 'eliminar') return !!ctx.esCliente; // solo clientes
        return false;

      case 'citas':
        return accion === 'ver'; // solo ver

      case 'historiales':
      case 'lineasHistorial':
        if (accion === 'ver' || accion === 'nuevo' || accion === 'editar') return true;
        if (accion === 'eliminar') return false;
        return false;

      case 'facturas':
        return accion === 'ver'; // solo ver facturas

      case 'lineasFactura':
        // puede añadir/editar líneas (y no eliminar)
        const cerrada = (ctx.estadoFactura || '').toLowerCase() === 'cerrada';
        if (accion === 'ver') return true;
        if (accion === 'eliminar') return false;
        if (accion === 'nuevo' || accion === 'editar') return cerrada;
        return false;

      case 'servicios':
        return accion === 'ver';

      case 'productos':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'eliminar') return false;
        if (accion === 'editar') return true; // campos limitados
        return false;

      case 'animales':
        if (accion === 'ver') return true;
        if (accion === 'nuevo' || accion === 'editar') return true;
        if (accion === 'eliminar') return false;
        return false;
    }
  }

  // ===== CLIENTE =====
  if (role === 'cliente') {
    switch (recurso) {
      case 'usuarios':
        // solo ver/editar su ficha, pero sin rol
        if (accion === 'ver' || accion === 'editar') return true;
        return false;

      case 'citas':
        // solo ver (y filtradas por propietario)
        return accion === 'ver';

      case 'animales':
        // solo ver/editar foto; el filtrado por propietario se hace en lista
        if (accion === 'ver') return true;
        if (accion === 'editar') return true; // pero solo foto
        return false;

      // no acceso a historiales/facturas/catalogo (en menú no aparecen)
      default:
        return false;
    }
  }

  return false;
}
