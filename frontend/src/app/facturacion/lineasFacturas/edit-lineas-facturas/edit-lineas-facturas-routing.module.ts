import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditLineasFacturasPage } from './edit-lineas-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: EditLineasFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditLineasFacturasPageRoutingModule {}
