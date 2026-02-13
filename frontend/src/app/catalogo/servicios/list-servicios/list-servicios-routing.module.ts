import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListServiciosPage } from './list-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: ListServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListServiciosPageRoutingModule {}
