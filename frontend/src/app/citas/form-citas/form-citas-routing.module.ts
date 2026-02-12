import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormCitasPage } from './form-citas.page';

const routes: Routes = [
  {
    path: '',
    component: FormCitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormCitasPageRoutingModule {}
