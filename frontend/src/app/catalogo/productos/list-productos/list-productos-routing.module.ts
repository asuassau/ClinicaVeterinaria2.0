import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListProductosPage } from './list-productos.page';

const routes: Routes = [
  {
    path: '',
    component: ListProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListProductosPageRoutingModule {}
