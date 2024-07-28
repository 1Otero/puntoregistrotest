import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreregisterRoutingModule } from './preregister-routing.module';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PreregisterComponent } from './pages/preregister/preregister.component';
import { StepsComponent } from './pages/steps/steps.component';
import { StepOneComponent } from './components/step-one/step-one.component';
import { StepTwoComponent } from './components/step-two/step-two.component';
import { StepThreeComponent } from './components/step-three/step-three.component';
import { EventInfoComponent } from './components/event-info/event-info.component';


@NgModule({
  declarations: [
    PreregisterComponent,
    StepsComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,
    EventInfoComponent
  ],
  imports: [
    CommonModule,
    PreregisterRoutingModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule
  ]
})
export class PreregisterModule { }
