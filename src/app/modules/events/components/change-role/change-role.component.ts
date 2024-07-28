import { Component, Inject } from '@angular/core';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { ITicket } from 'src/app/models/ticket.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { EventService } from 'src/app/services/event.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IClientRoles } from 'src/app/models/event.model';
import { AssistantService } from 'src/app/services/assistant.service';

interface InputData {
  ticket: ITicket;
  assistant: IUserAssistant;
  adminUserId: number;
  eventId: number;
  roles: IClientRoles[];
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.scss'],
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
export class ChangeRoleComponent {

  ticket: ITicket | null = null;
  adminUserId: number = 0;
  eventId: number = 0;
  attendant: IUserAssistant = {
    userId: null,
    clientId: 0,
    loadListId: null,
    idTypeDoc: 0,
    docId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    secondLastName: "",
    email: "",
    phoneNumber: "",
    birthday: 0,
    gender: "",
    rh: null,
    eventId: 0,
    agreedToTermsOfUse: null,
    viewAccessPoint: null,
    register: false,
    registration: 0,
    registerPoint: false,
    errorMessage: null,
    infoVariable: '',
    logdel: true
  };
  status: RequestStatus = 'init';
  dialogAnimationState: 'in' | 'out' = 'in';
  roles: IClientRoles[] = [];

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private eventService: EventService,
    private assistantService: AssistantService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.ticket = data.ticket;
      this.adminUserId = data.adminUserId;
      this.eventId = data.eventId;
      this.attendant = data.assistant;
      this.roles = data.roles
    }
  }

  form = this.formBuilder.nonNullable.group({
    rol: ['', [Validators.required]],
    description: ['', [Validators.required]],
  });

  save() {
    if (this.form.valid) {
      this.status = 'loading';
      const { rol, description } = this.form.getRawValue();
      const data = {
        ticketId: this.ticket?.ticketId,
        eventId: this.eventId,
        userId: this.attendant.userId,
        roleIdNew: Number(rol),
        description: description,
        adminUserId: this.adminUserId
      }
      this.eventService.updateRolTicketUser(data).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            this.toastrService.success('Rol cambiado correctamente');
            this.status = 'success';
            this.close();
            this.assistantService.refresh.next();
          } else {
            this.toastrService.info(data.errorMessage.message);
            this.status = 'failed';
          }
        },
        error: (error) => {
          this.toastrService.error(error);
          this.status = 'failed';
        }
      })
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
