import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditServiciosPage } from './edit-servicios.page';

const routes: Routes = [
  {
    path: '',
    component: EditServiciosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditServiciosPageRoutingModule {}
