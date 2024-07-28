import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITicketUserRegister } from 'src/app/models/assistant.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AssistantService } from 'src/app/services/assistant.service';
import { environment } from 'src/environments/environment';

interface InputData {
  tickets: ITicketUserRegister[];
  userId: number;
  assistantId: number;
  eventId: number;
  isSave: boolean;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}

interface ControlData {
  tikectId: number;
  control: number;
}

@Component({
  selector: 'app-save-ticket-control',
  templateUrl: './save-ticket-control.component.html',
  styleUrls: ['./save-ticket-control.component.scss'],
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
export class SaveTicketControlComponent implements OnInit {

  status: RequestStatus = 'init';
  listTickets: ITicketUserRegister[] = [];
  dialogAnimationState: 'in' | 'out' = 'in';
  typeAssing: number = 1;
  userId: number = 0;
  assistantId: number = 0;
  eventId: number = 0;
  adminUserId: number = 0;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private assistantService: AssistantService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.adminUserId = data.adminUserId;
      this.userId = data.userId;
      this.assistantId = data.assistantId;
      this.eventId = data.eventId;
      this.listTickets = data.tickets.filter(item => (item.isAssigned === 0 || item.isAssigned === 5));
    }
  }

  ngOnInit(): void {
    this.listTickets.map(item => {
      this.agregarCampoFromBack(item.ticket.ticketId, item.ticket.key1, item.ticket.key2, item.ticket.numControl ? item.ticket.numControl.toString() : '');
    })
  }

  form = this.formBuilder.nonNullable.group({
    control: ['', [Validators.required, Validators.pattern(/^0*[1-9][0-9]*$/)]],
  });

  formAll = new FormGroup({
    tickets: this.formBuilder.array([])
  });

  get fieldArray() {
    return this.formAll.get('tickets') as FormArray;
  }


  agregarCampoFromBack(ticketId: number, key1: string, key2: string, control: string) {
    const nuevoCampo = this.formBuilder.group({
      ticketId: [ticketId],
      key: [key1 + ' - ' + key2],
      control: [control, [Validators.required, Validators.pattern(/^0*[1-9][0-9]*$/)]],
    });
    this.fieldArray.push(nuevoCampo);
  }


  saveControl() {
    if (this.form.valid) {
      this.status = 'loading';
      const { control } = this.form.getRawValue();
      let tikects: number[] = [];
      let controls: string[] = [];
      for (let i = 0; i < this.fieldArray.length; i++) {
        const ticketGroup = this.fieldArray.at(i) as FormGroup;
        const tikectId = ticketGroup.get('ticketId')?.value;
        const key = ticketGroup.get('key')?.value;
        if (tikectId && control) {
          tikects.push(tikectId);
          controls.push(Number(control).toString());
        }
      }
      const dataControl = {
        ticketIds: tikects,
        userId: this.userId,
        assistantId: this.assistantId,
        barCode: controls,
        eventId: this.eventId
      }
      this.assistantService.assignControl(dataControl, this.adminUserId).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            const success = data.payload.success;
            const error = data.payload.error;
            if (error.length === 0 && success.length !== 0) {
              this.toastrService.success('Controles asignados correctamente');
              this.close();
              this.status = 'success';
            } else {
              success.map(item => {
                this.toastrService.success(item);
              });
              error.map(item => {
                this.toastrService.info(item);
              });
              this.status = 'failed';
            }
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

  saveControls() {
    if (this.formAll.valid) {
      this.status = 'loading';
      let tikects: number[] = [];
      let controls: string[] = [];
      for (let i = 0; i < this.fieldArray.length; i++) {
        const ticketGroup = this.fieldArray.at(i) as FormGroup;
        const tikectId = ticketGroup.get('ticketId')?.value;
        const key = ticketGroup.get('key')?.value;
        const control = ticketGroup.get('control')?.value;
        if (tikectId && control) {
          tikects.push(tikectId);
          controls.push(control.toString())
        }
      }
      const dataControl = {
        ticketIds: tikects,
        userId: this.userId,
        assistantId: this.assistantId,
        barCode: controls,
        eventId: this.eventId
      }
      this.assistantService.assignControl(dataControl, this.adminUserId).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            const success = data.payload.success;
            const error = data.payload.error;
            if (error.length === 0 && success.length !== 0) {
              this.toastrService.success('Controles asignados correctamente');
              this.close();
              this.status = 'success';
            } else {
              success.map(item => {
                this.toastrService.success(item);
              });
              error.map(item => {
                this.toastrService.info(item);
              });
              this.status = 'failed';
            }
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
      this.formAll.markAllAsTouched();
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }

}
