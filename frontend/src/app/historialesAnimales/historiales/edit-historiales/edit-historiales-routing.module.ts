import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditHistorialesPage } from './edit-historiales.page';

const routes: Routes = [
  {
    path: '',
    component: EditHistorialesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditHistorialesPageRoutingModule {}
