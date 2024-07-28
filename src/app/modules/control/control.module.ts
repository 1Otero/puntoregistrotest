import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlRoutingModule } from './control-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ControlComponent } from './pages/control/control.component';
import { ControlCardComponent } from './components/control-card/control-card.component';
import { ControlSaveComponent } from './components/control-save/control-save.component';
import { SharedModule } from '../shared/shared.module';
import { CreateControlComponent } from './components/create-control/create-control.component';


@NgModule({
  declarations: [
    ControlComponent,
    ControlCardComponent,
    ControlSaveComponent,
    CreateControlComponent
  ],
  imports: [
    CommonModule,
    ControlRoutingModule,
    FormsModule,
    OverlayModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedModule,
    MatRadioModule,
    MatCheckboxModule
  ]
})
export class ControlModule { }
