import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditAnimalesPage } from './edit-animales.page';

const routes: Routes = [
  {
    path: '',
    component: EditAnimalesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditAnimalesPageRoutingModule {}
