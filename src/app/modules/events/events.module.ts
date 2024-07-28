import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';

import { EventsComponent } from './pages/events/events.component';
import { CardReaderFormComponent } from './components/card-reader-form/card-reader-form.component';
import { ManualFormComponent } from './components/manual-form/manual-form.component';
import { QrFormComponent } from './components/qr-form/qr-form.component';
import { QuorumComponent } from './components/quorum/quorum.component';
import { RegisterComponent } from './pages/register/register.component';
import { TicketsComponent } from './components/tickets/tickets.component';
import { SaveTicketPhoneComponent } from './components/save-ticket-phone/save-ticket-phone.component';
import { SaveTicketControlComponent } from './components/save-ticket-control/save-ticket-control.component';
import { SaveTicketControlUserComponent } from './components/save-ticket-control-user/save-ticket-control-user.component';
import { InfoEventComponent } from './components/info-event/info-event.component';
import { InfoClientComponent } from './components/info-client/info-client.component';
import { InfoClientCardComponent } from './components/info-client-card/info-client-card.component';
import { ChangeUserComponent } from './components/change-user/change-user.component';
import { EditUserComponent } from './components/edit-user/edit-user.component';
import { ExitComponent } from './pages/exit/exit.component';
import { ExitRegisterComponent } from './pages/exit-register/exit-register.component';
import { TicketsExitComponent } from './components/tickets-exit/tickets-exit.component';
import { QuorumInfoComponent } from './pages/quorum/quorum.component';
import { ChangeRoleComponent } from './components/change-role/change-role.component';
import { QuorumReadingComponent } from './components/quorum-reading/quorum-reading.component';
import { QuorumReadingTicketsComponent } from './components/quorum-reading-tickets/quorum-reading-tickets.component';
import { QuorumFormComponent } from './components/quorum-form/quorum-form.component';
import { ExitTypeComponent } from './components/exit-type/exit-type.component';
import { ExitTicketComponent } from './components/exit-ticket/exit-ticket.component';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [
    EventsComponent,
    CardReaderFormComponent,
    ManualFormComponent,
    QrFormComponent,
    QuorumComponent,
    RegisterComponent,
    TicketsComponent,
    SaveTicketPhoneComponent,
    SaveTicketControlComponent,
    SaveTicketControlUserComponent,
    InfoEventComponent,
    InfoClientComponent,
    InfoClientCardComponent,
    ChangeUserComponent,
    EditUserComponent,
    ExitComponent,
    ExitRegisterComponent,
    TicketsExitComponent,
    QuorumInfoComponent,
    ChangeRoleComponent,
    QuorumReadingComponent,
    QuorumReadingTicketsComponent,
    QuorumFormComponent,
    ExitTypeComponent,
    ExitTicketComponent
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    MatAutocompleteModule,
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CdkAccordionModule,
    MatCheckboxModule,
    MatRadioModule,
    OverlayModule,
    FormsModule,
    MatSelectModule,
    MatTabsModule
  ]
})
export class EventsModule { }
