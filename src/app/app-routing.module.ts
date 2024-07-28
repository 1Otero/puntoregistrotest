import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectInitialGuard } from './guards/redirect-initial.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    canActivate: [RedirectInitialGuard],
    loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'punto-registro-operador',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/layout-operator/layout-operator.module').then((m) => m.LayoutOperatorModule),
  },
  {
    path: 'preregistro',
    canActivate: [AuthGuard],
    loadChildren: () => import('./modules/preregister/preregister.module').then((m) => m.PreregisterModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
