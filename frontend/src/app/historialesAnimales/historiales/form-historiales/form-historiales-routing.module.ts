import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormHistorialesPage } from './form-historiales.page';

const routes: Routes = [
  {
    path: '',
    component: FormHistorialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormHistorialesPageRoutingModule {}
