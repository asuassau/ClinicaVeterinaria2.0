import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProductosPage } from './edit-productos.page';

const routes: Routes = [
  {
    path: '',
    component: EditProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProductosPageRoutingModule {}
