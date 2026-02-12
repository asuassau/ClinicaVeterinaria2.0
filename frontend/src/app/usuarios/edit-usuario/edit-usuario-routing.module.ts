import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUsuarioPage } from './edit-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: EditUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditUsuarioPageRoutingModule {}
