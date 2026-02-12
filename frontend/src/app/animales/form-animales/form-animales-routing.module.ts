import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormAnimalesPage } from './form-animales.page';

const routes: Routes = [
  {
    path: '',
    component: FormAnimalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAnimalesPageRoutingModule {}
