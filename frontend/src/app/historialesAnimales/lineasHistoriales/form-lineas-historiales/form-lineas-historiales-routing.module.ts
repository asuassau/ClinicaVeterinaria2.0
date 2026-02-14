import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormLineasHistorialesPage } from './form-lineas-historiales.page';

const routes: Routes = [
  {
    path: '',
    component: FormLineasHistorialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormLineasHistorialesPageRoutingModule {}
