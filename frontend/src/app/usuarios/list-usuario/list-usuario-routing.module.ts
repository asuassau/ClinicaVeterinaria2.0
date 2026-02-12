import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListUsuarioPage } from './list-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ListUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListUsuarioPageRoutingModule {}
