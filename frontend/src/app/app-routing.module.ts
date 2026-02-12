import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'list-usuario',
    loadChildren: () => import('./usuarios/list-usuario/list-usuario.module').then( m => m.ListUsuarioPageModule)
  },
  {
    path: 'form-usuario',
    loadChildren: () => import('./usuarios/form-usuario/form-usuario.module').then( m => m.FormUsuarioPageModule)
  },
  {
    path: 'edit-usuario/:id',
    loadChildren: () => import('./usuarios/edit-usuario/edit-usuario.module').then( m => m.EditUsuarioPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
