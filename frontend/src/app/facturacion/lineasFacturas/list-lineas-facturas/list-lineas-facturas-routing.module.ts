import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListLineasFacturasPage } from './list-lineas-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: ListLineasFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListLineasFacturasPageRoutingModule {}
