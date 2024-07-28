import { Component, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RequestStatus } from 'src/app/models/request-status.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITicket } from 'src/app/models/ticket.model';
import { AssistantService } from 'src/app/services/assistant.service';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { environment } from 'src/environments/environment';
import { IClientRoles } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';


interface InputData {
  ticket: ITicket;
  eventId: number;
  userId: number;
  attendant: IUserAssistant;
  assistantPropietario: IUserAssistant;
  rol: string;
  deviceType: number;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-change-user',
  templateUrl: './change-user.component.html',
  styleUrls: ['./change-user.component.scss'],
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
export class ChangeUserComponent {

  status: RequestStatus = 'init';
  dialogAnimationState: 'in' | 'out' = 'in';
  ticket: ITicket | null = null;
  userId: number = 0;
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
  attendantPropietario: IUserAssistant = {
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
  rol: string = '';
  roles: IClientRoles[] = [];
  deviceType: number = 0;
  form: FormGroup;
  adminUserId: number = 0;
  

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private assistantService: AssistantService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.adminUserId = data.adminUserId;
      this.deviceType = data.deviceType;
      if(this.deviceType === 1){
        this.form = this.formBuilder.nonNullable.group({
          rol: ['', [Validators.required]],
          control: ['',[Validators.required]],
          decriptChange: ['', [Validators.required]]
        });
      } else {
        this.form = this.formBuilder.nonNullable.group({
          rol: ['', [Validators.required]],
          control: [''],
          decriptChange: ['', [Validators.required]]
        });
      }
      this.attendant = data.attendant;
      this.attendantPropietario = data.assistantPropietario;
      this.ticket = data.ticket;
      this.userId = data.userId;
      this.eventId = data.eventId;
      this.rol = data.rol;
    }
    this.eventService.roles.subscribe(data => {
      if(data){
        this.roles = data;
        this.form.patchValue({
          rol: this.roles[0].clientRoleId.toString()
        })
      }
    })
  }

  changeUser() {
    if (this.form.valid) {
      this.status = 'loading';
      const { rol, decriptChange, control } = this.form.getRawValue();
      const data = {
        userId: this.attendantPropietario.userId,
        docNumber: this.attendant.docId,
        typDocument: this.attendant.idTypeDoc,
        eventId: this.eventId,
        roleId: Number(rol),
        ticketIds: [this.ticket?.ticketId],
        description: decriptChange,
        barCode: Number(control).toString(),
        adminUserId: this.adminUserId
      }
      this.assistantService.changeUser(data, this.adminUserId).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            this.status = 'success';
            this.toastrService.success('Actualizado correctamente');
            this.close();
          } else {
            this.toastrService.info(data.errorMessage.message);
            this.status = 'failed';
          }
        },
        error: (error) => {
          console.error(error);
          this.status = 'failed';
          this.toastrService.error(environment.messageError)
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
