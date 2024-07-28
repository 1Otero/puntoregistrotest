import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ClientRoutingModule } from './client-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { OverlayModule } from '@angular/cdk/overlay';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

import { ClientComponent } from './pages/client/client.component';
import { SharedModule } from '../shared/shared.module';
import { CardClientComponent } from './components/card-client/card-client.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientInfoComponent } from './pages/client-info/client-info.component';
import { GridEventComponent } from './components/grid-event/grid-event.component';
import { SaveClientComponent } from './components/save-client/save-client.component';
import { SaveDataEventComponent } from './components/save-data-event/save-data-event.component';
import { EventConfigComponent } from './pages/event-config/event-config.component';
import { InfoVariableComponent } from './components/info-variable/info-variable.component';
import { ListClientComponent } from './components/list-client/list-client.component';
import { ListEventComponent } from './components/list-event/list-event.component';


@NgModule({
  declarations: [
    ClientComponent,
    CardClientComponent,
    ClientsComponent,
    ClientInfoComponent,
    GridEventComponent,
    SaveClientComponent,
    SaveDataEventComponent,
    EventConfigComponent,
    InfoVariableComponent,
    ListClientComponent,
    ListEventComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    OverlayModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSortModule,
    MatSelectModule
  ]
})
export class ClientModule { }
