import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCitasPage } from './list-citas.page';

const routes: Routes = [
  {
    path: '',
    component: ListCitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCitasPageRoutingModule {}
