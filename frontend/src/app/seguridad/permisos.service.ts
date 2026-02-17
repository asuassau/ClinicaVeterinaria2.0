import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { can, canField, Role, Recurso, Accion, Ctx, Field } from './permisos';

@Injectable({ providedIn: 'root' })
export class PermisosService {
  constructor(private auth: AuthService) {}

  role(): Role {
    return (this.auth.getUserRole() as Role) || 'cliente';
  }

  can(recurso: Recurso, accion: Accion, ctx: Ctx = {}): boolean {
    return can(this.role(), recurso, accion, ctx);
  }

  canField(field: Field, accion: Accion = 'editar', ctx: Ctx = {}): boolean {
    return canField(this.role(), field, accion, ctx);
  }
}
