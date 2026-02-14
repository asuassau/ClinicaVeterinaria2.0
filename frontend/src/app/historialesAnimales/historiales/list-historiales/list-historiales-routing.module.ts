import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListHistorialesPage } from './list-historiales.page';

const routes: Routes = [
  {
    path: '',
    component: ListHistorialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListHistorialesPageRoutingModule {}
