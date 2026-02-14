import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormLineasFacturasPage } from './form-lineas-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: FormLineasFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormLineasFacturasPageRoutingModule {}
