import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RequestStatus } from 'src/app/models/request-status.model';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { EventService } from 'src/app/services/event.service';
import { IControl } from 'src/app/models/control.model';
import { environment } from 'src/environments/environment';

interface InputData {

}

interface OutputData {
  rta: boolean;
  control: IControl;
}

@Component({
  selector: 'app-create-control',
  templateUrl: './create-control.component.html',
  styleUrls: ['./create-control.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      state('out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.4s ease-out')
      ]),
      transition('* => out', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('0.4s ease-in')
      ])
    ])
  ]
})
export class CreateControlComponent {

  status: RequestStatus = 'init';
  dialogAnimationState: 'in' | 'out' = 'in';
  control: IControl = {
    idControl: 0,
    keyControl: 0,
    type: '',
    barCode: '',
    maker: '',
    model: '',
    purchaseDate: new Date(),
    batteryChangeDate: new Date(),
    lastEvent: '',
    lastUser: 0,
    lastAssistant: 0,
    description: '',
    physicalState: '',
    status: 0
  }

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private eventService: EventService,
  ) { }

  form = this.formBuilder.nonNullable.group({
    numeroControl: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });

  saveClient() {
    if (this.form.valid) {
      this.status = 'loading';
      const { numeroControl } = this.form.getRawValue();
      this.control = {
        ... this.control,
        barCode: numeroControl,
        keyControl: Number(numeroControl),
        status: 1
      }
      this.eventService.createControl(this.control).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            this.status = 'success';
            this.toastrService.success('Control registrado correctamente');
            this.close(true, this.control);
          } else {
            this.toastrService.info(data.errorMessage.message);
            this.status = 'failed';
          }
        },
        error: (error) => {
          console.error(error);
          this.status = 'failed';
          this.toastrService.error(environment.messageError);
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  close(rta: boolean, control: IControl) {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close({
        rta: rta,
        control: control
      });
    }, 600);
  }
}
