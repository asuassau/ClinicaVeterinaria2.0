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
  },
  {
    path: 'list-animales',
    loadChildren: () => import('./animales/list-animales/list-animales.module').then( m => m.ListAnimalesPageModule)
  },
  {
    path: 'form-animales',
    loadChildren: () => import('./animales/form-animales/form-animales.module').then( m => m.FormAnimalesPageModule)
  },
  {
    path: 'edit-animales/:id',
    loadChildren: () => import('./animales/edit-animales/edit-animales.module').then( m => m.EditAnimalesPageModule)
  },
  {
    path: 'list-citas',
    loadChildren: () => import('./citas/list-citas/list-citas.module').then( m => m.ListCitasPageModule)
  },
  {
    path: 'form-citas',
    loadChildren: () => import('./citas/form-citas/form-citas.module').then( m => m.FormCitasPageModule)
  },
  {
    path: 'edit-citas/:id',
    loadChildren: () => import('./citas/edit-citas/edit-citas.module').then( m => m.EditCitasPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
