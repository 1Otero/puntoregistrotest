import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { EventsComponent } from './pages/events/events.component';
import { NoConfigureComponent } from './pages/no-configure/no-configure.component';
import { ExitComponent } from '../events/pages/exit/exit.component';
import { RoleGuard } from 'src/app/guards/role.guard';
import { NoAvailableComponent } from './pages/no-available/no-available.component';
import { EventConfigComponent } from '../client/pages/event-config/event-config.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'codigo',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5,6] },
        component: EventsComponent,
      },
      {
        path: 'salida',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5,6] },
        component: ExitComponent,
      },
      {
        path: 'configuracion-evento',
        component: EventConfigComponent
      },
      {
        path: 'cliente',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1] },
        loadChildren: () => import('../../modules/client/client.module').then((m) => m.ClientModule),
      },
      {
        path: 'evento',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5,6] },
        loadChildren: () => import('../../modules/events/events.module').then((m) => m.EventsModule),
      },
      {
        path: 'configuracion',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5] },
        loadChildren: () => import('../../modules/configuration/configuration.module').then((m) => m.ConfigurationModule),
      },
      {
        path: 'base-de-datos',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5] },
        loadChildren: () => import('../../modules/data-base/data-base.module').then((m) => m.DataBaseModule),
      },
      {
        path: 'analitica',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5,6] },
        loadChildren: () => import('../../modules/analytics/analytics.module').then((m) => m.AnalyticsModule),
      },
      {
        path: 'no-configurado',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5,6] },
        component: NoConfigureComponent
      },
      {
        path: 'cerrado',
        canActivate: [RoleGuard],
        data: { requiredRoles: [1,5,6] },
        component: NoAvailableComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutOperatorRoutingModule { }
