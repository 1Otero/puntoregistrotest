import { Component, Inject, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IControl } from 'src/app/models/control.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

interface InputData {
  control: IControl;
}

interface OutputData {
  rta: boolean;
  control: IControl;
}

@Component({
  selector: 'app-control-save',
  templateUrl: './control-save.component.html',
  styleUrls: ['./control-save.component.scss'],
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
export class ControlSaveComponent implements OnInit {

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
    status: 0,
  };
  controlStatus = [
    {
      id: 0,
      name: 'Dañado'
    },
    {
      id: 1,
      name: 'Disponible'
    },
    {
      id: 2,
      name: 'Asignado a un evento'
    },
    {
      id: 3,
      name: 'En uso'
    },
    {
      id: 5,
      name: 'Devuelto'
    }
  ];
  controlEstadoFisico = [
    {
      id: 0,
      name: 'Bueno'
    },
    {
      id: 1,
      name: 'Regular'
    },
    {
      id: 2,
      name: 'Malo'
    }
  ]

constructor(
  private dialogRef: DialogRef<OutputData>,
  private formBuilder: FormBuilder,
  private eventService: EventService,
  private toastrService: ToastrService,
  @Inject(DIALOG_DATA) data: InputData
) {
  if (data) {
    this.control = data.control;
    this.form.patchValue({
      estado: this.control.status.toString(),
      estadoFisico: this.control.physicalState?.toString()
    });
  }
}

form = this.formBuilder.nonNullable.group({
  estado: ['', [Validators.required]],
  estadoFisico: ['', [Validators.required]],
});

ngOnInit(): void {
}

saveControl() {
  if (this.form.valid) {
    this.status = 'loading';
    const { estado, estadoFisico } = this.form.getRawValue();
    this.control = {
      ... this.control,
      status: Number(estado),
      physicalState: estadoFisico
    }
    this.eventService.updateVoteOffline(this.control).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.status = 'success';
          this.close({
            rta: true,
            control: this.control
          });
          this.toastrService.success('Control actualizado correctamente');
        } else {
          this.toastrService.info(data.errorMessage.message);
          this.status = 'failed';
        }
      },
      error: (error) => {
        console.error(error);
        this.toastrService.error(environment.messageError);
        this.status = 'failed';
      }
    })
  } else {
    this.form.markAllAsTouched();
  }
}


close(input: OutputData) {
  this.dialogAnimationState = 'out';
  setTimeout(() => {
    this.dialogRef.close(input);
  }, 600);
}

}
