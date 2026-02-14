import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListLineasHistorialesPage } from './list-lineas-historiales.page';

const routes: Routes = [
  {
    path: '',
    component: ListLineasHistorialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListLineasHistorialesPageRoutingModule {}
