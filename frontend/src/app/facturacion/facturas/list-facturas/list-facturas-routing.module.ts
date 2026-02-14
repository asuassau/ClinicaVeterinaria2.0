import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListFacturasPage } from './list-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: ListFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListFacturasPageRoutingModule {}
