import { Component, Inject } from '@angular/core';
import { ITicket } from 'src/app/models/ticket.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequestStatus } from 'src/app/models/request-status.model';
import { Observable, map, startWith } from 'rxjs';
import { IClientRoles, IEvent } from 'src/app/models/event.model';
import { ITicketUserData } from 'src/app/models/ticket-user.model';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { AssistantService } from 'src/app/services/assistant.service';
import { TicketService } from 'src/app/services/ticket.service';
import { EventService } from 'src/app/services/event.service';

interface InputData {
  tickets: ITicket[];
  event: IEvent;
  assistant: IUserAssistant;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-save-ticket-phone',
  templateUrl: './save-ticket-phone.component.html',
  styleUrls: ['./save-ticket-phone.component.scss'],
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

export class SaveTicketPhoneComponent {

  status: RequestStatus = 'init';
  listTickets: ITicket[] = [];
  filteredOptionsTickets: Observable<ITicket[]>;
  dialogAnimationState: 'in' | 'out' = 'in';
  event: IEvent = {
    eventId: 0,
    modifiedUserId: 0,
    clientId: 0,
    name: '',
    status: 0,
    type: null,
    date: 0,
    date2: 0,
    imageId: 0,
    folderDocumentId: 0,
    phone: '',
    whatsapp: '',
    email: '',
    urlEvent: '',
    labelUrl: '',
    dateStartPreregistration: 0,
    dateEndPreregistration: 0,
    timezone: '',
    def: '',
    active: false,
    dateStartEvent: 0,
    dateEndEvent: 0,
    selectEvent: false,
    vottingTypeId: 0,
    dataBase: false,
    preregistration: false,
    registrationPoint: false,
    app: false,
    videoCall: false,
    typeEvent: 0,
    freeEvent: 0,
    codEvent: 0
  };
  ticketUser: ITicketUserData = {
    ticketUserId: 0,
    eventId: 0,
    ticketId: 0,
    userId: 0,
    roleId: 0,
    clientId: 0,
    description: '',
    logdel: false,
    status: 0,
  }
  assistant: IUserAssistant = {
    userId: 0,
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
  roles: IClientRoles[] = [];
  adminUserId: number = 0;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private assistanService: AssistantService,
    private ticketService: TicketService,
    private eventService: EventService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.adminUserId = data.adminUserId;
      this.event = data.event;
      this.assistant = data.assistant;
      this.listTickets = data.tickets;
      this.filteredOptionsTickets = this.form.controls.ticket.valueChanges.pipe(
        startWith(''),
        map(value => this.filterTicket(value || '')),
      );
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

  form = this.formBuilder.nonNullable.group({
    ticket: ['', [Validators.required]],
    rol: ['1'],
  });

  saveTicket() {
    if (this.form.valid) {
      this.status = 'loading';
      const { ticket, rol } = this.form.getRawValue();
      const userId = this.assistant.userId;
      this.ticketUser = {
        ... this.ticketUser,
        eventId: this.event.eventId,
        ticketId: this.findIdTicket(ticket),
        clientId: this.event.clientId,
        userId: userId ? userId: 0,
        roleId: Number(rol),
        status: 1,
        logdel: true
      }
      this.assistanService.addTicket(this.ticketUser, this.adminUserId).subscribe({
        next: (data) => {
          if(data.status === 'success'){
            this.toastrService.success('Registro del ticket exitoso')
            this.close();
          } else {
            this.toastrService.info(data.errorMessage.message);
            this.status = 'failed';
          }
        },
        error: (error) => {
          console.error(error);
          this.status = 'failed'
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  filterTicket(value: string): ITicket[] {
    const filterValue = value.toLowerCase();
    return this.listTickets.filter(option => (option.key1 + ' - ' + option.key2).toLowerCase().includes(filterValue));
  }


  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }

  findIdTicket(key: string){
    const ticketId = this.listTickets.find(item => (item.key1 + ' - ' + item.key2) === key)?.ticketId;
    if(ticketId){
      return ticketId;
    }
    return 0;
  }

}
