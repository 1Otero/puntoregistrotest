import { Component, Inject } from '@angular/core';
import { ITicket } from 'src/app/models/ticket.model';
import { IUserAssistant } from 'src/app/models/user-admin.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IAssistantDataWithTickets } from 'src/app/models/assistant.model';
import { IClientRoles } from 'src/app/models/event.model';
import { Observable, map, startWith } from 'rxjs';
import { ITicketUserData } from 'src/app/models/ticket-user.model';
import { AssistantService } from 'src/app/services/assistant.service';
import { ToastrService } from 'ngx-toastr';

interface InputData {
  userAssistants: IAssistantDataWithTickets[];
  ticekts: ITicket[];
  typeSave: 'ticket' | 'assistant' | 'assistant-ticket';
  eventId: number;
  clientId: number;
  adminUserId: number;
  roles: IClientRoles[];
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-save-assistant-ticket',
  templateUrl: './save-assistant-ticket.component.html',
  styleUrls: ['./save-assistant-ticket.component.scss'],
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
export class SaveAssistantTicketComponent {

  userAssistants: IAssistantDataWithTickets[] = [];
  filteredOptionsUsers: Observable<IAssistantDataWithTickets[]>;
  ticekts: ITicket[] = [];
  filteredOptionsTickets: Observable<ITicket[]>;
  roles: IClientRoles[] = [];
  typeSave: 'ticket' | 'assistant' | 'assistant-ticket' = 'ticket';
  eventId: number = 0;
  clientId: number = 0;
  adminUserId: number = 0;
  dialogAnimationState: 'in' | 'out' = 'in';
  status: RequestStatus = 'init';
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
  
  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private assistanService: AssistantService,
    private toastrService: ToastrService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.userAssistants = data.userAssistants;
      this.ticekts = data.ticekts;
      this.typeSave = data.typeSave;
      this.eventId = data.eventId;
      this.clientId = data.clientId;
      this.adminUserId = data.adminUserId;
      this.roles = data.roles;
      this.form.patchValue({
        rol: this.roles[0].clientRoleId.toString()
      })
      this.filteredOptionsTickets = this.form.controls.ticket.valueChanges.pipe(
        startWith(''),
        map(value => this.filterTicket(value || '')),
      );
      this.filteredOptionsUsers = this.form.controls.user.valueChanges.pipe(
        startWith(''),
        map(value => this.filterUsers(value || '')),
      );
    }
  }

  form = this.formBuilder.nonNullable.group({
    ticket: ['', [Validators.required]],
    user: ['', [Validators.required]],
    rol: ['', [Validators.required]],
  });

  filterTicket(value: string): ITicket[] {
    const filterValue = value.toLowerCase();
    return this.ticekts.filter(option => (option.key1 + ' - ' + option.key2).toLowerCase().includes(filterValue));
  }

  filterUsers(value: string): IAssistantDataWithTickets[] {
    const filterValue = value.toLowerCase();
    return this.userAssistants.filter(option => ((option.userAssistant.idTypeDoc === 1 ? 'CC' : 'NIT') + ' - ' + option.userAssistant.docId + ' - ' + (option.userAssistant.firstName + ' ' + option.userAssistant.lastName)).toLowerCase().includes(filterValue));
  }

  dataEvent(option: IAssistantDataWithTickets) {
    return (option.userAssistant.idTypeDoc === 1 ? 'CC' : 'NIT') + ' - ' + option.userAssistant.docId + ' - ' + (option.userAssistant.firstName + ' ' + option.userAssistant.lastName);
  }

  save() {
    if (this.form.valid) {
      this.status = 'loading';
      const { ticket, rol, user } = this.form.getRawValue();
      const typeDoc: number = Number(user.split('-')[0].trim() === 'CC' ? 1 : 2);
      const doc: string = user.split('-')[1].trim();
      this.ticketUser = {
        ... this.ticketUser,
        eventId: this.eventId,
        ticketId: this.findIdTicket(ticket),
        clientId: this.clientId,
        userId: this.findIdUser(typeDoc, doc),
        roleId: Number(rol),
        status: 1,
        logdel: true
      }
      this.assistanService.addTicket(this.ticketUser, this.adminUserId).subscribe({
        next: (data) => {
          if(data.status === 'success'){
            this.toastrService.success('Registro completado');
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

  findIdTicket(key: string){
    const ticketId = this.ticekts.find(item => (item.key1 + ' - ' + item.key2) === key)?.ticketId;
    if(ticketId){
      return ticketId;
    }
    return 0;
  }

  findIdUser(typeDoc: number, doc: string){
    const user = this.userAssistants.find(item => item.userAssistant.idTypeDoc === typeDoc && item.userAssistant.docId === doc);
    if(user){
      if(user.userAssistant.userId){
        return user.userAssistant.userId;
      }
      return 0;
    }
    return 0;
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }
}
