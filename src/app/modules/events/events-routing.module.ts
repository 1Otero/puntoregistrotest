import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './pages/events/events.component';
import { RegisterComponent } from './pages/register/register.component';
import { RegisterGuard } from 'src/app/guards/register.guard';
import { ExitRegisterComponent } from './pages/exit-register/exit-register.component';
import { QuorumInfoComponent } from './pages/quorum/quorum.component';

const routes: Routes = [
  {
    path: '',
    component: EventsComponent
  },
  {
    path: 'registro',
    component: RegisterComponent,
    canDeactivate: [RegisterGuard]
  },
  {
    path: 'salida',
    component: ExitRegisterComponent,
  },
  {
    path: 'quorum',
    component: QuorumInfoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
