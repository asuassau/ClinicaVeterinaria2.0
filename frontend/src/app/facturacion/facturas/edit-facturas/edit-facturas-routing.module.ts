import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditFacturasPage } from './edit-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: EditFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditFacturasPageRoutingModule {}
