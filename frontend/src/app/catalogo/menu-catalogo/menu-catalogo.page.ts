import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-catalogo',
  templateUrl: './menu-catalogo.page.html',
  styleUrls: ['./menu-catalogo.page.scss'],
  standalone: false,
})
export class MenuCatalogoPage {

  constructor(private router: Router) {}

  irServicios() {
    this.router.navigate(['/list-servicios']); // ajusta ruta si cambia
  }

  irProductos() {
    this.router.navigate(['/list-productos']); // ajusta ruta si cambia
  }

      volver() {
    this.router.navigate(['/menu']);  
  }
}
