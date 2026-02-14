import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormFacturasPage } from './form-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: FormFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormFacturasPageRoutingModule {}
