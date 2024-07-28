import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { DataBaseRoutingModule } from './data-base-routing.module';
import { DataBaseComponent } from './pages/data-base/data-base.component';
import { TicketDataBaseComponent } from './components/ticket-data-base/ticket-data-base.component';
import { CardTicketComponent } from './components/card-ticket/card-ticket.component';
import { CardUsuarioComponent } from './components/card-usuario/card-usuario.component';
import { FileComponent } from './components/file/file.component';
import { ListErrorInitialChargeComponent } from './components/list-error-initial-charge/list-error-initial-charge.component';
import { SharedModule } from '../shared/shared.module';
import { SaveTicketComponent } from './components/save-ticket/save-ticket.component';
import { SaveAssistantComponent } from './components/save-assistant/save-assistant.component';
import { HistoryComponent } from './pages/history/history.component';
import { TicketComponent } from './pages/ticket/ticket.component';
import { AssistantComponent } from './pages/assistant/assistant.component';
import { TicketAssistantComponent } from './pages/ticket-assistant/ticket-assistant.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { SaveAssistantTicketComponent } from './components/save-assistant-ticket/save-assistant-ticket.component';

@NgModule({
  declarations: [
    DataBaseComponent,
    TicketDataBaseComponent,
    CardTicketComponent,
    CardUsuarioComponent,
    FileComponent,
    ListErrorInitialChargeComponent,
    SaveTicketComponent,
    SaveAssistantComponent,
    HistoryComponent,
    TicketComponent,
    AssistantComponent,
    TicketAssistantComponent,
    TicketsComponent,
    SaveAssistantTicketComponent,
  ],
  imports: [
    CommonModule,
    DataBaseRoutingModule,
    MatTabsModule,
    MatIconModule,
    FormsModule,
    MatTableModule,
    OverlayModule,
    MatPaginatorModule,
    SharedModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    DialogModule,
    MatSortModule,
    MatSelectModule,
    MatAutocompleteModule
  ]
})
export class DataBaseModule { }
