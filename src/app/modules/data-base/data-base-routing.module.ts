import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataBaseComponent } from './pages/data-base/data-base.component';
import { HistoryComponent } from './pages/history/history.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { AssistantComponent } from './pages/assistant/assistant.component';
import { TicketAssistantComponent } from './pages/ticket-assistant/ticket-assistant.component';

const routes: Routes = [
  {
    path: '',
    component: DataBaseComponent,
    children: [
      {
        path: 'historial',
        component: HistoryComponent
      },
      {
        path: 'votos',
        component: TicketComponent
      },
      {
        path: 'asistentes',
        component: AssistantComponent
      },
      {
        path: 'votos-asistentes',
        component: TicketAssistantComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataBaseRoutingModule { }
