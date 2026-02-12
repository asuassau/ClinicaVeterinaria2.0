import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCitasPage } from './edit-citas.page';

const routes: Routes = [
  {
    path: '',
    component: EditCitasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditCitasPageRoutingModule {}
