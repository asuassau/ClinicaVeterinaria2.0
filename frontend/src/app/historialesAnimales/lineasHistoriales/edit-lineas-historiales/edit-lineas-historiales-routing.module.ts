import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditLineasHistorialesPage } from './edit-lineas-historiales.page';

const routes: Routes = [
  {
    path: '',
    component: EditLineasHistorialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditLineasHistorialesPageRoutingModule {}
