import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAnimalesPage } from './list-animales.page';

const routes: Routes = [
  {
    path: '',
    component: ListAnimalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAnimalesPageRoutingModule {}
