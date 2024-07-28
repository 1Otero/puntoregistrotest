import { Component, Inject } from '@angular/core';
import { RequestStatus } from 'src/app/models/request-status.model';
import { ITicket } from 'src/app/models/ticket.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AssistantService } from 'src/app/services/assistant.service';
import { environment } from 'src/environments/environment';

interface InputData {
  ticket: ITicket;
  userId: number;
  assistantId: number;
  eventId: number;
  isSave: boolean;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-save-ticket-control-user',
  templateUrl: './save-ticket-control-user.component.html',
  styleUrls: ['./save-ticket-control-user.component.scss'],
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
export class SaveTicketControlUserComponent {

  status: RequestStatus = 'init';
  ticket: ITicket = {
    ticketId: 0,
    eventId: 0,
    clientId: 0,
    groupId: '',
    loadListId: 0,
    key1: '',
    key2: '',
    description: '',
    coefficient: 0,
    units: 0,
    voteOfflineId: 0,
    logdel: true,
    available: true,
    register: 0,
    token: 0,
    numControl: 0,
    status: 0
  }
  dialogAnimationState: 'in' | 'out' = 'in';
  userId: number = 0;
  assistantId: number = 0;
  eventId: number = 0;
  isSave: boolean = true;
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
      this.ticket = data.ticket;
      this.userId = data.userId;
      this.assistantId = data.assistantId;
      this.eventId = data.eventId;
      this.isSave = data.isSave;
      this.form.patchValue({
        control: this.ticket.numControl ? this.ticket.numControl.toString() : ''
      });
      if(!this.isSave){
        this.form.get('cambio')?.setValidators(Validators.required);
      }
    }
  }

  form = this.formBuilder.nonNullable.group({
    control: ['', [Validators.required]],
    cambio: ['']
  });

  saveControl() {
    if (this.form.valid) {
      this.status = 'loading';
      const { control, cambio } = this.form.getRawValue();
      const dataControl = {
        ticketIds: [this.ticket.ticketId],
        userId: this.userId,
        assistantId: this.assistantId,
        barCode: [control],
        eventId: this.eventId
      }
      if (this.isSave) {
        this.assistantService.assignControl(dataControl, this.adminUserId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              const success = data.payload.success;
              const error = data.payload.error;
              if (error.length === 0 && success.length !== 0) {
                this.toastrService.success('Control asignado correctamente');
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
        });
      } else {
        const dataControl = {
          ticketIds: [this.ticket.ticketId],
          userId: this.userId,
          assistantId: this.assistantId,
          barCode: Number(control).toString(),
          eventId: this.eventId,
          oldKeyControl: this.ticket.numControl,
          status: 5,
          description: cambio
        }
        this.assistantService.changeControl(dataControl, this.adminUserId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
                this.toastrService.success('Control cambiado correctamente');
                this.close();
                this.status = 'success';              
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
        });
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }

}
