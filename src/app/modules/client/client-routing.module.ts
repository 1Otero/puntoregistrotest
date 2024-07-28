import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientComponent } from './pages/client/client.component';
import { ClientInfoComponent } from './pages/client-info/client-info.component';

const routes: Routes = [
  {
    path: '',
    component: ClientComponent
  },
  {
    path: ':id',
    component: ClientInfoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
