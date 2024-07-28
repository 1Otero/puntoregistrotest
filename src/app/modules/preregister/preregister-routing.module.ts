import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreregisterComponent } from './pages/preregister/preregister.component';
import { StepsComponent } from './pages/steps/steps.component';

const routes: Routes = [
  {
    path: '',
    component: PreregisterComponent,
    children: [
      {
        path: 'registro',
        component: StepsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreregisterRoutingModule { }
