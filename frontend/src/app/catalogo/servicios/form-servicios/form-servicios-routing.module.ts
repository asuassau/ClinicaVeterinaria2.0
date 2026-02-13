import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormServiciosPage } from './form-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: FormServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormServiciosPageRoutingModule {}
