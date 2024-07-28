import { Dialog } from '@angular/cdk/dialog';
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAssistantDataRegister, ITicketUserRegister } from 'src/app/models/assistant.model';
import { IConfigRegistrationPoint, IEvent, IEventConfig, IQuorum, IQuorumCreate } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AssistantService } from 'src/app/services/assistant.service';
import { EventService } from 'src/app/services/event.service';
import { SaveTicketPhoneComponent } from '../../components/save-ticket-phone/save-ticket-phone.component';
import { ITicket } from 'src/app/models/ticket.model';
import { Subscription } from 'rxjs';
import { SaveTicketControlComponent } from '../../components/save-ticket-control/save-ticket-control.component';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';
import { IAccessPointCreate } from 'src/app/models/access-point.model';
import { AccessPointService } from 'src/app/services/access-point.service';
import { ToastrService } from 'ngx-toastr';
import { IDeactiveGuard } from 'src/app/guards/register.guard';
import { ConfirmExitComponent } from 'src/app/modules/shared/components/confirm-exit/confirm-exit.component';
import { Title } from '@angular/platform-browser';
import { DocumentHistoryService } from 'src/app/services/document-history.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { OutputData } from 'src/app/models/data.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, IDeactiveGuard, AfterViewInit {

  statusIngress: RequestStatus = 'init';
  statusTicket: RequestStatus = 'init';
  statusConrol: RequestStatus = 'init';
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
  messageInfoClient: string = '';
  isAdmin: boolean = false;
  formValid: boolean = false;
  // tickets
  ticketsIngresados: ITicketUserRegister[] = [];
  ticketsAusentes: ITicketUserRegister[] = [];
  ticketsIngresadosOtroAsistente: ITicketUserRegister[] = [];
  ticketsInactivos: ITicketUserRegister[] = [];
  @ViewChild('numeroControl') numeroDocumentoInput: ElementRef;
  @ViewChild('numeroControl2') numeroDocumentoInput2: ElementRef;


  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private assistantService: AssistantService,
    private authService: AuthService,
    private dialog: Dialog,
    private accessPointService: AccessPointService,
    private toastrService: ToastrService,
    private titleService: Title,
    private documentHistoryService: DocumentHistoryService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.titleService.setTitle('Registro');
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

  ngAfterViewInit(): void {
 
  }

  form = this.formBuilder.nonNullable.group({
    control: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });

  canExit() {
    if (this.totalTikects !== 0) {
      if (this.ticketsDisponibles !== 0) {
        return new Promise<boolean>((resolve, reject) => {
          const dialogRef = this.dialog.open<boolean>(ConfirmExitComponent,
            {
              data: {
                title: 'Tiene los siguientes tickets por ingresar',
                tickets: this.assistant.listTicketByUserWithRol.filter(item => item.isAssigned === 0),
              }
            }
          );
          dialogRef.closed.subscribe(result => {
            resolve(!!result);
          });
        });
      } else {
        return true;
      }
    } else {
      return true;
    }

  }

  ngOnInit(): void {
    this.eventService.event.subscribe(data => {
      this.statusTicket = 'loading';
      if (data) {
        this.eventConfig = data;
        if (this.eventConfig.event.status === 0) {
          const queryParams = {
            eventCode: Number(this.eventCode),
          };
          this.router.navigate(['punto-registro-operador/cerrado'], { queryParams: queryParams })
        }
        this.assistantService.getAttendantRegister(this.eventConfig.event.eventId, this.userId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.assistant = data.payload;
              this.myTickets = data.payload.listTicketByUserWithRol.filter(item => (item.isAssigned === 1 || item.isAssigned === 0)).length;
              this.ticketsIngresados = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 1);
              this.ticketsIngresadosOtroAsistente = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 2);
              this.ticketsInactivos = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 4);
              this.ticketsAusentes = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 5);
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
                this.ticketsIngresados = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 1);
                this.ticketsAusentes = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 5);
                this.ticketsIngresadosOtroAsistente = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 2);
                this.ticketsInactivos = data.payload.listTicketByUserWithRol.filter(item => item.isAssigned === 4);
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
        this.isAdmin = this.user.idRol.includes(1);
      }
    });
    this.eventService.tickets.subscribe(data => {
      if (data) {
        this.listTickets = data;
      }
    })
  }

  back() {
    const queryParams = {
      eventCode: Number(this.eventCode),
    };
    this.router.navigate(['punto-registro-operador/evento'], { queryParams: queryParams });
  }

  addTicket() {
    this.dialog.open(SaveTicketPhoneComponent, {
      data: {
        tickets: this.listTickets,
        event: this.eventConfig.event,
        assistant: this.assistant.attendant,
        adminUserId: this.adminUserId
      }
    })
  }

  assingControls() {
    if (this.form.valid) {
      this.statusConrol = 'loading';
      const { control } = this.form.getRawValue();
      const listTickets = this.assistant.listTicketByUserWithRol.filter(item => (item.isAssigned === 0 || item.isAssigned === 5));
      let tikects: number[] = [];
      let controls: string[] = [];
      listTickets.map(item => {
        const tikectId = item.ticket.ticketId;
        if (tikectId && control) {
          tikects.push(tikectId);
          controls.push(Number(control).toString());
        }
      })
      const dataControl = {
        ticketIds: tikects,
        userId: this.userId,
        assistantId: this.assistant.attendant.userId,
        barCode: controls,
        eventId: this.eventConfig.event.eventId
      }
      this.assistantService.assignControl(dataControl, this.adminUserId).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            const success = data.payload.success;
            const error = data.payload.error;
            if (error.length === 0 && success.length !== 0) {
              this.toastrService.success('Controles asignados correctamente');
              this.statusConrol = 'success';
            } else {
              success.map(item => {
                this.toastrService.success(item);
              });
              error.map(item => {
                this.toastrService.info(item);
              });
              this.statusConrol = 'failed';
            }
          } else {
            this.toastrService.info(data.errorMessage.message);
            this.statusConrol = 'failed';
          }
        },
        error: (error) => {
          console.error(error);
          this.toastrService.error(environment.messageError);
          this.statusConrol = 'failed';
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
    // this.dialog.open(SaveTicketControlComponent, {
    //   data: {
    //     tickets: this.assistant.listTicketByUserWithRol,
    //     userId: this.user?.adminUserId,
    //     assistantId: this.assistant.attendant.userId,
    //     eventId: this.eventConfig.event.eventId,
    //   }
    // })
  }

  onAssignOneToOne() {
    this.dialog.open(SaveTicketControlComponent, {
      data: {
        tickets: this.assistant.listTicketByUserWithRol,
        userId: this.user?.adminUserId,
        assistantId: this.assistant.attendant.userId,
        eventId: this.eventConfig.event.eventId,
      }
    })
  }

  calcularCoeficiente() {
    const listCoeficiente = this.assistant.listTicketByUserWithRol.filter(item => (item.isAssigned === 0 || item.isAssigned === 1 || item.isAssigned === 2 || item.isAssigned === 5));
    this.coeficiente = listCoeficiente.reduce((total, ticket) => total + ticket.ticket.coefficient, 0);
    this.unidades = listCoeficiente.reduce((total, ticket) => total + ticket.ticket.units, 0);
    this.aprobados = this.assistant.listTicketByUserWithRol.filter(item => item.isAssigned === 1).length;
    this.totalTikects = listCoeficiente.length;
  }

  typeIngress() {
    if (this.eventConfig.configRegistrationPoint.deviceType === 1) {
      if (this.ticketsDisponibles === this.numControl) {
        if (this.eventConfig.configRegistrationPoint.showInfoClient === 1) {
          if (!this.formValid) {
            this.ingress(3);
          } else {
            this.ingress(1);
          }
        } else {
          this.ingress(1);
        }
      } else {
        this.ingress(2);
      }
    } else {
      if (this.eventConfig.configRegistrationPoint.showInfoClient === 1) {
        if (!this.formValid) {
          this.ingress(3);
        } else {
          this.ingress(1);
        }
      } else {
        this.ingress(1);
      }
    }
  }

  ingress(type: number) {
    if (type === 1) {
      if (this.assistant.listTicketByUserWithRol.filter(item => item.isAssigned === 0 || item.isAssigned === 1).length !== 0) {
        if (this.user) {
          this.statusIngress = 'loading';
          let tickets: number[] = [];
          this.assistant.listTicketByUserWithRol.filter(item => item.isAssigned === 0 || item.isAssigned === 1).map(item => {
            tickets.push(item.ticket.ticketId)
          });
          this.accessPoint = {
            eventId: this.assistant.attendant.eventId,
            userId: this.userId,
            clientId: this.assistant.attendant.clientId,
            ticketIds: tickets
          }
          this.accessPointService.save(this.accessPoint, this.adminUserId).subscribe({
            next: (data) => {
              if (data) {
                this.toastrService.success('Ingresado correctamente');
                const quorum: IQuorumCreate = {
                  eventId: this.eventConfig.event.eventId,
                  type: 1,
                }
                this.eventService.saveChartQuorum(quorum).subscribe(data => {

                });
                if (this.user) {
                  this.authService.notifyfrontconnectforquorum(this.eventConfig.event.eventId).subscribe(data => {
                  })
                  this.assistantService.refresh.next();
                  this.documentHistoryService.refresh.next();
                  this.statusTicket = 'loading';
                }
                this.statusIngress = 'success';
              }
            },
            error: (error) => {
              console.error(error)
              this.statusIngress = 'failed';
            }
          })
        }
      } else {
        if (this.message === '') {
          this.message = 'Actualmente no hay tickets registrados para este usuario, o bien, esos tickets ya han sido asignados a otro usuario.';
        } else {
          this.message = '';
          setTimeout(() => {
            this.message = 'Actualmente no hay tickets registrados para este usuario, o bien, esos tickets ya han sido asignados a otro usuario.';
          }, 500);
        }
      }
    } else if (type === 2) {
      if (this.message === '') {
        this.message = 'Faltan controles por asignar';
      } else {
        this.message = '';
        setTimeout(() => {
          this.message = 'Faltan controles por asignar';
        }, 500);
      }
    } else if (type === 3) {
      if (this.messageInfoClient === '') {
        this.messageInfoClient = 'Completar información y guardar';
      } else {
        this.message = '';
        setTimeout(() => {
          this.messageInfoClient = 'Completar información y guardar';
        }, 500);
      }
    }
  }

  onFormValid(valid: boolean) {
    this.formValid = valid;
  }

  deleteAbsence() {
    this.dialog.open<OutputData>(DeleteComponent,
      {
        data: {
          title: '¿Está seguro que desea eliminar la ausencia a este usuario?'
        }
      }
    ).closed.subscribe(data => {
      if (data?.rta) {
        this.statusIngress = 'loading';
        let tickets: number[] = [];
        this.ticketsAusentes.map(item => {
          tickets.push(item.ticket.ticketId)
        });
        const accessPoint: IAccessPointCreate = {
          eventId: this.assistant.attendant.eventId,
          userId: this.userId,
          clientId: this.assistant.attendant.clientId,
          ticketIds: tickets
        };
        this.accessPointService.save(accessPoint, this.adminUserId).subscribe({
          next: (data) => {
            if (data) {
              this.toastrService.success('Ausencia eliminada correctamente');
              const quorum: IQuorumCreate = {
                eventId: this.eventConfig.event.eventId,
                type: 1,
              }
              this.eventService.saveChartQuorum(quorum).subscribe(data => {

              });
              if (this.user) {
                this.authService.notifyfrontconnectforquorum(this.eventConfig.event.eventId).subscribe(data => {
                })
                this.assistantService.refresh.next();
                this.documentHistoryService.refresh.next();
                this.statusTicket = 'loading';
              }
              this.statusIngress = 'success';
            }
          },
          error: (error) => {
            console.error(error)
            this.statusIngress = 'failed';
          }
        });
      }
    })
  }

}
