import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

type Role = 'administrador' | 'veterinario' | 'recepcionista' | 'cliente';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
  roles: Role[];
  description?: string;
}

const ALL_MENU_ITEMS: MenuItem[] = [
  {
    title: 'Usuarios',
    
    url: '/list-usuario',
    icon: 'people',
    roles: ['administrador', 'recepcionista'],
    description: 'Gestión de usuarios, roles y acceso a datos relacionados',
  },
  {
    title: 'Citas',
    url: '/list-citas',
    icon: 'calendar',
    roles: ['administrador', 'veterinario', 'recepcionista', 'cliente'],
    description: 'Listado, búsqueda y CRUD de citas',
  },
  {
    title: 'Historiales',
    url: '/historiales',
    icon: 'document-text',
    roles: ['administrador', 'veterinario'],
    description: 'Listado, búsqueda y CRUD de historiales clínicos',
  },
  {
    title: 'Facturas',
    url: '/facturas',
    icon: 'receipt',
    roles: ['administrador', 'recepcionista', 'cliente'],
    description: 'Listado, búsqueda y CRUD de facturas',
  },
  {
    title: 'Catálogo',
    url: '/catalogo',
    icon: 'pricetag',
    roles: ['administrador'],
    description: 'Productos y servicios',
  },
  {
    title: 'Animales',
    url: '/list-animales',
    icon: 'paw',
    roles: ['administrador', 'veterinario', 'cliente'],
    description: 'Listado, búsqueda y CRUD de animales',
  },
];
@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage  {
  role: Role | '' = '';
  roleLabel = '';
  menuItems: MenuItem[] = [];

  // Opcional: si tu AuthService expone datos del usuario
  userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    const role = this.authService.getUserRole() as Role | null;
    this.role = role ?? '';

    this.roleLabel = this.getRoleLabel(this.role);
    this.menuItems = ALL_MENU_ITEMS.filter(item => item.roles.includes(this.role as Role));

    // Si tienes método para obtener email/usuario, úsalo; si no, deja null.
    try {
      // Ajusta esto a tu implementación real si es distinta:
      const user: any = (this.authService as any).getUser?.();
      this.userEmail = user?.email ?? null;
    } catch {
      this.userEmail = null;
    }

    // Si no hay rol/sesión válida, vuelve a login
    if (!this.role) {
      this.router.navigate(['/login']);
    }
  }

  goTo(item: MenuItem) {
    this.router.navigate([item.url]);
  }

  logout() {
    // Ajusta a tu servicio: clearSession/logout/etc.
    if ((this.authService as any).logout) {
      (this.authService as any).logout();
    } else if ((this.authService as any).clearSession) {
      (this.authService as any).clearSession();
    }

    this.router.navigate(['/login']);
  }

  private getRoleLabel(role: Role | ''): string {
    switch (role) {
      case 'administrador': return 'Administrador';
      case 'veterinario': return 'Veterinario';
      case 'recepcionista': return 'Recepcionista';
      case 'cliente': return 'Cliente';
      default: return '';
    }
  }
}
