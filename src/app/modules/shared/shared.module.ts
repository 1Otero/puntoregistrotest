import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './components/button/button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NoDataComponent } from './components/no-data/no-data.component';
import { DeleteComponent } from './components/delete/delete.component';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmChargeComponent } from './components/confirm-charge/confirm-charge.component';
import { ConfirmExitComponent } from './components/confirm-exit/confirm-exit.component';


@NgModule({
  declarations: [
    ButtonComponent,
    SpinnerComponent,
    NoDataComponent,
    DeleteComponent,
    ConfirmChargeComponent,
    ConfirmExitComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressSpinnerModule
  ],
  exports: [ButtonComponent, SpinnerComponent, NoDataComponent, DeleteComponent]
})
export class SharedModule { }
