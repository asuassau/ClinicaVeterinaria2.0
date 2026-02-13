import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormProductosPage } from './form-productos.page';

const routes: Routes = [
  {
    path: '',
    component: FormProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormProductosPageRoutingModule {}
