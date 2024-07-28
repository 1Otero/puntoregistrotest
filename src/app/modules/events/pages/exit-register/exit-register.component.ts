import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IAccessPointCreate } from 'src/app/models/access-point.model';
import { IAssistantDataRegister } from 'src/app/models/assistant.model';
import { IConfigRegistrationPoint, IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { ITicket } from 'src/app/models/ticket.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AccessPointService } from 'src/app/services/access-point.service';
import { AssistantService } from 'src/app/services/assistant.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-exit-register',
  templateUrl: './exit-register.component.html',
  styleUrls: ['./exit-register.component.scss']
})
export class ExitRegisterComponent {

  statusIngress: RequestStatus = 'init';
  statusTicket: RequestStatus = 'init';
  eventCode: number = 0;
  userId: number = 0;
  eventConfig: IEventConfig = {
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
  }
  assistant: IAssistantDataRegister = {
    attendant: {
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
      logdel: true,
    },
    listTicketByUserWithRol: [],
    accessPointUser: {
      accessPointUserId: 0,
      tokenStatus: 0,
      groupTicket: null,
      role: "",
      userId: 0,
      eventId: 0,
      logdel: true,
      absent: false,
      status: 0
    }
  }
  listTickets: ITicket[] = [];
  subscription: Subscription;
  coeficiente: number = 0;
  aprobados: number = 0;
  unidades: number = 0;
  myTickets: number = 0;
  user: IUserAdmin | null = null;
  accessPoint: IAccessPointCreate = {
    eventId: 0,
    userId: 0,
    clientId: 0,
    ticketIds: [],
  };
  adminUserId: number = 0;
  message: string = '';
  totalTikects: number = 0;
  ticketsDisponibles: number = 0;
  listConfig: IConfigRegistrationPoint[] = [];
  numControl: number = 0;

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private assistantService: AssistantService,
    private authService: AuthService,
    private dialog: Dialog,
    private accessPointService: AccessPointService,
    private toastrService: ToastrService,
    private titleService: Title
  ){
    this.titleService.setTitle('Salida');
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      const userId = params.get('userId');
      if (eventCode && userId) {
        this.eventCode = Number(eventCode);
        this.userId = Number(userId);
      } else {
        this.router.navigate(['/punto-registro-operador/codigo']);
      }
    });
  }


  ngOnInit(): void {
    this.eventService.event.subscribe(data => {
      this.statusTicket = 'loading';
      if (data) {
        this.eventConfig = data;
        if(this.eventConfig.event.status === 0){
          const queryParams = {
            eventCode: Number(this.eventCode),
          };
          this.router.navigate(['punto-registro-operador/cerrado'],{ queryParams: queryParams })
        }
        this.assistantService.getAttendantRegister(this.eventConfig.event.eventId, this.userId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.assistant = data.payload;
              this.myTickets = data.payload.listTicketByUserWithRol.filter(item => (item.isAssigned === 1 || item.isAssigned === 0)).length;
              this.ticketsDisponibles = data.payload.listTicketByUserWithRol.filter(item => (item.isAssigned === 0)).length;
              this.numControl = data.payload.listTicketByUserWithRol.filter(item => (item.isAssigned === 0)).filter(item => item.ticket.numControl !== 0).length;
              this.statusTicket = 'success';
              this.calcularCoeficiente();
            }
          },
          error: (error) => {
            console.error(error);
            this.statusTicket = 'failed';
          }
        });
        this.subscription = this.assistantService.refresh.subscribe(() => {
          this.statusTicket = 'loading';
          this.assistant.listTicketByUserWithRol = [];
          this.assistantService.getAttendantRegister(this.eventConfig.event.eventId, this.userId).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                this.assistant = data.payload;
                this.myTickets = data.payload.listTicketByUserWithRol.filter(item => (item.isAssigned === 1 || item.isAssigned === 0)).length;
                this.ticketsDisponibles = data.payload.listTicketByUserWithRol.filter(item => (item.isAssigned === 0)).length;
                this.numControl = data.payload.listTicketByUserWithRol.filter(item => (item.isAssigned === 0)).filter(item => item.ticket.numControl !== 0).length;
                this.statusTicket = 'success';
                this.calcularCoeficiente();
              }
            },
            error: (error) => {
              console.error(error);
              this.statusTicket = 'failed';
            }
          });
        });

        this.eventService.getInfoVariable(this.eventConfig.event.eventId, 'pointRegister').subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.listConfig = data.payload;
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
      }
    });
    this.authService.user.subscribe(data => {
      if (data) {
        this.user = data;
        this.adminUserId = this.user.adminUserId;
      }
    });
    this.eventService.tickets.subscribe(data => {
      if (data) {
        this.listTickets = data;
      }
    })
  }

  calcularCoeficiente() {
    const listCoeficiente = this.assistant.listTicketByUserWithRol.filter(item => (item.isAssigned === 0 || item.isAssigned === 1 || item.isAssigned === 2));
    this.coeficiente = listCoeficiente.reduce((total, ticket) => total + ticket.ticket.coefficient, 0);
    this.unidades = listCoeficiente.reduce((total, ticket) => total + ticket.ticket.units, 0);
    this.aprobados = this.assistant.listTicketByUserWithRol.filter(item => item.isAssigned === 1).length;
    this.totalTikects = listCoeficiente.length;
  }

  back() {
    const queryParams = {
      eventCode: Number(this.eventCode),
    };
    this.router.navigate(['punto-registro-operador/salida'], { queryParams: queryParams });
  }
}
