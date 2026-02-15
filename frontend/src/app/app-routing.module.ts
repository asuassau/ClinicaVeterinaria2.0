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
  },
  {
    path: 'menu-catalogo',
    loadChildren: () => import('./catalogo/menu-catalogo/menu-catalogo.module').then( m => m.MenuCatalogoPageModule)
  },
  {
    path: 'list-productos',
    loadChildren: () => import('./catalogo/productos/list-productos/list-productos.module').then( m => m.ListProductosPageModule)
  },
  {
    path: 'form-productos',
    loadChildren: () => import('./catalogo/productos/form-productos/form-productos.module').then( m => m.FormProductosPageModule)
  },
  {
    path: 'edit-productos/:id',
    loadChildren: () => import('./catalogo/productos/edit-productos/edit-productos.module').then( m => m.EditProductosPageModule)
  },
  {
    path: 'list-servicios',
    loadChildren: () => import('./catalogo/servicios/list-servicios/list-servicios.module').then( m => m.ListServiciosPageModule)
  },
  {
    path: 'form-servicios',
    loadChildren: () => import('./catalogo/servicios/form-servicios/form-servicios.module').then( m => m.FormServiciosPageModule)
  },
  {
    path: 'edit-servicios/:id',
    loadChildren: () => import('./catalogo/servicios/edit-servicios/edit-servicios.module').then( m => m.EditServiciosPageModule)
  },
  {
    path: 'list-facturas',
    loadChildren: () => import('./facturacion/facturas/list-facturas/list-facturas.module').then( m => m.ListFacturasPageModule)
  },
  {
    path: 'list-lineas-facturas',
    loadChildren: () => import('./facturacion/lineasFacturas/list-lineas-facturas/list-lineas-facturas.module').then( m => m.ListLineasFacturasPageModule)
  },
  {
    path: 'form-lineas-facturas',
    loadChildren: () => import('./facturacion/lineasFacturas/form-lineas-facturas/form-lineas-facturas.module').then( m => m.FormLineasFacturasPageModule)
  },
{
  path: 'edit-lineas-facturas/:id',
  loadChildren: () => import('./facturacion/lineasFacturas/edit-lineas-facturas/edit-lineas-facturas.module')
    .then(m => m.EditLineasFacturasPageModule)
},
  {
    path: 'form-facturas',
    loadChildren: () => import('./facturacion/facturas/form-facturas/form-facturas.module').then( m => m.FormFacturasPageModule)
  },
  {
    path: 'edit-facturas/:id',
    loadChildren: () => import('./facturacion/facturas/edit-facturas/edit-facturas.module').then( m => m.EditFacturasPageModule)
  },
  {
    path: 'list-historiales',
    loadChildren: () => import('./historialesAnimales/historiales/list-historiales/list-historiales.module').then( m => m.ListHistorialesPageModule)
  },
  {
    path: 'list-lineas-historiales',
    loadChildren: () => import('./historialesAnimales/lineasHistoriales/list-lineas-historiales/list-lineas-historiales.module').then( m => m.ListLineasHistorialesPageModule)
  },
  {
    path: 'form-lineas-historiales',
    loadChildren: () => import('./historialesAnimales/lineasHistoriales/form-lineas-historiales/form-lineas-historiales.module').then( m => m.FormLineasHistorialesPageModule)
  },
  {
    path: 'edit-lineas-historiales/:id',
    loadChildren: () => import('./historialesAnimales/lineasHistoriales/edit-lineas-historiales/edit-lineas-historiales.module').then( m => m.EditLineasHistorialesPageModule)
  },
  {
    path: 'form-historiales',
    loadChildren: () => import('./historialesAnimales/historiales/form-historiales/form-historiales.module').then( m => m.FormHistorialesPageModule)
  },
  {
    path: 'edit-historiales/:id',
    loadChildren: () => import('./historialesAnimales/historiales/edit-historiales/edit-historiales.module').then( m => m.EditHistorialesPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
