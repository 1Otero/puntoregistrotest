import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ITicketUserRegister, IUserAssistant } from 'src/app/models/assistant.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { AssistantService } from 'src/app/services/assistant.service';
import { ToastrService } from 'ngx-toastr';
import { OutputData } from 'src/app/models/data.model';
import { SaveTicketControlUserComponent } from '../save-ticket-control-user/save-ticket-control-user.component';
import { ITicket } from 'src/app/models/ticket.model';
import { IClientRoles, IEventConfig } from 'src/app/models/event.model';
import { ChangeUserComponent } from '../change-user/change-user.component';
import { environment } from 'src/environments/environment';
import { TicketService } from 'src/app/services/ticket.service';
import { ChangeRoleComponent } from '../change-role/change-role.component';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit, OnChanges {

  @Input() listTicketByUserWithRol: ITicketUserRegister[] = [];
  @Input() attendant: IUserAssistant = {
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
  @Input() assigned: number = 0;
  @Input() title: string = '';
  @Input() eventId: number = 0;
  @Input() adminUserId: number = 0;
  @Input() eventConfig: IEventConfig = {
    event: {
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
    },
    configRegistrationPoint: {
      configRegistrationPointId: 0,
      eventId: 0,
      isPublic: 0,
      deviceType: 0,
      vottingType: 0,
      email: 0,
      phone: 0,
      print: 0,
      showInfoClient: 0,
      coefficient: 0,
      units: 0,
      nominal: 0,
    }
  };
  @Input() isAdmin: boolean = false;
  roles: IClientRoles[] = [];

  constructor(
    private dialog: Dialog,
    private assistanService: AssistantService,
    private toastrService: ToastrService,
    private ticketService: TicketService,
    private eventService: EventService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.listTicketByUserWithRol = this.listTicketByUserWithRol.filter(itme => itme.isAssigned === this.assigned);
  }

  ngOnInit(): void {
    this.eventService.roles.subscribe(data => {
      if(data){
        this.roles = data;
      }
    })
    this.listTicketByUserWithRol = this.listTicketByUserWithRol.filter(itme => itme.isAssigned === this.assigned);
  }

  onDelete(assistant: ITicketUserRegister) {
    this.dialog.open<OutputData>(DeleteComponent,
      {
        data: {
          title: '¿Está seguro que desea eliminar el ingreso para este usuario?'
        }
      }).closed.subscribe(data => {
        if (data?.rta) {
          const userId = this.attendant.userId;
          this.assistanService.removeTicket(userId ? userId : 0, assistant.ticket.ticketId, this.eventId, data.message, this.adminUserId).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                this.toastrService.success('Ingreso eliminado correctamente');
              }
            },
            error: (error) => {
              console.error(error);
            }
          })
        }
      })
  }

  onDeleteTicketUser(assistant: ITicketUserRegister) {
    this.dialog.open<OutputData>(DeleteComponent,
      {
        data: {
          title: '¿Está seguro que desea eliminar el ticket para este usuario?'
        }
      }).closed.subscribe(data => {
        if (data?.rta) {
          const userId = this.attendant.userId;
          this.assistanService.disableTicket(userId ? userId : 0, assistant.ticket.ticketId, this.eventId, data.message, this.adminUserId).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                this.toastrService.success('Ticket eliminado correctamente');
              } else {
                this.toastrService.info(data.errorMessage.message);
              }
            },
            error: (error) => {
              console.error(error);
              this.toastrService.error(environment.messageError);
            }
          })
        }
      })
  }

  control(ticket: ITicket, isSave: boolean) {
    this.dialog.open(SaveTicketControlUserComponent, {
      data: {
        ticket: ticket,
        userId: this.adminUserId,
        assistantId: this.attendant.userId,
        eventId: this.eventConfig.event.eventId,
        isSave: isSave,
        adminUserId: this.adminUserId
      }
    })
  }

  changeUser(ticket: ITicket, assistantPropietario: IUserAssistant, rol: string) {
    this.dialog.open(ChangeUserComponent,
      {
        data: {
          ticket: ticket,
          eventId: this.eventConfig.event.eventId,
          userId: this.attendant.userId,
          attendant: this.attendant,
          assistantPropietario: assistantPropietario,
          rol: rol,
          deviceType: this.eventConfig.configRegistrationPoint.deviceType,
          adminUserId: this.adminUserId,
        }
      }
    )
  }

  changeFormatDate(date: number) : boolean {
    const today = new Date();
    const providedDate = new Date(date);

    return today.getFullYear() === providedDate.getFullYear() &&
      today.getMonth() === providedDate.getMonth() &&
      today.getDate() === providedDate.getDate();
  }

  onActive(ticket: ITicket){
    delete ticket.isOpen;
    delete ticket.isSelect;
    this.dialog.open<OutputData>(DeleteComponent, {
      data: {
        title: '¿Está seguro que desea '+ (ticket.status === 0 ? 'activar' : 'inactivar') + ' este ticket?',
        messageButton: (ticket.status === 0 ? 'Activar' : 'Inactivar')
      }
    }).closed.subscribe(data => {
      if(data?.rta){
        ticket = {
          ... ticket,
          status: ticket.status === 0 ? 1 : 0
        }
        this.ticketService.update(ticket).subscribe({
          next: (data) => {
            if(data.status === 'success'){
              this.toastrService.success('Ticket ' + (data.payload.status === 1 ? 'activado' : 'inactivado') + ' correctamente');
              this.assistanService.refresh.next();
            } else {
              this.toastrService.info(data.errorMessage.message);
            }
          },
          error: (error) => {
            console.error(error);
            this.toastrService.error(environment.messageError);
          }
        })
      }
    });
  }

  updateRol(ticket: ITicketUserRegister){
    this.dialog.open(ChangeRoleComponent, {
      data: {
        ticket: ticket.ticket,
        assistant: this.attendant,
        eventId: this.eventId,
        adminUserId: this.adminUserId,
        roles: this.roles
      }
    })
  }
}
