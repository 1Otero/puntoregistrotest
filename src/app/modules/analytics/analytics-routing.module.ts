import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyticsComponent
  },
  {
    path: 'control',
    loadChildren: () => import('../../modules/control/control.module').then((m) => m.ControlModule),
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyticsRoutingModule { }
