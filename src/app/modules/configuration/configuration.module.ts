import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { ConfigurationComponent } from './pages/configuration/configuration.component';
import { SharedModule } from '../shared/shared.module';
import { InfoVariableComponent } from './components/info-variable/info-variable.component';


@NgModule({
  declarations: [
    ConfigurationComponent,
    InfoVariableComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    ReactiveFormsModule,
    MatRadioModule,
    SharedModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule
  ]
})
export class ConfigurationModule { }
