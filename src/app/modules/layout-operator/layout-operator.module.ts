import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { DialogModule } from '@angular/cdk/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { LayoutOperatorRoutingModule } from './layout-operator-routing.module';
import { LayoutComponent } from './pages/layout/layout.component';
import { EventCodeComponent } from './components/event-code/event-code.component';
import { EventsComponent } from './pages/events/events.component';
import { SharedModule } from '../shared/shared.module';
import { GridEventComponent } from './components/grid-event/grid-event.component';
import { NoConfigureComponent } from './pages/no-configure/no-configure.component';
import { NoAvailableComponent } from './pages/no-available/no-available.component';
import { InfoVariableComponent } from './components/info-variable/info-variable.component';


@NgModule({
  declarations: [
    LayoutComponent,
    EventCodeComponent,
    EventsComponent,
    GridEventComponent,
    NoConfigureComponent,
    NoAvailableComponent,
    InfoVariableComponent
  ],
  imports: [
    CommonModule,
    LayoutOperatorRoutingModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    SharedModule,
    OverlayModule,
    DialogModule,
    MatRadioModule,
    MatCheckboxModule
  ]
})
export class LayoutOperatorModule { }
