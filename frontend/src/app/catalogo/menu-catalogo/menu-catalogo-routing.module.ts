import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuCatalogoPage } from './menu-catalogo.page';

const routes: Routes = [
  {
    path: '',
    component: MenuCatalogoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuCatalogoPageRoutingModule {}
