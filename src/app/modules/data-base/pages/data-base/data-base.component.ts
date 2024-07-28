import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { AssistantService } from 'src/app/services/assistant.service';
import { DocumentHistoryService } from 'src/app/services/document-history.service';
import { EventService } from 'src/app/services/event.service';
import { TicketService } from 'src/app/services/ticket.service';

@Component({
  selector: 'app-data-base',
  templateUrl: './data-base.component.html',
  styleUrls: ['./data-base.component.scss']
})
export class DataBaseComponent implements OnInit, OnDestroy {
  @Output() fileSelected = new EventEmitter<File>();
  fileName: string | null = null;
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
  };
  eventCode: number = 0;
  status: RequestStatus = 'init';
  subscription: Subscription;
  subscriptionAssistant: Subscription;
  showMessage: boolean = false;

  constructor(
    private eventService: EventService,
    private documentHistoryService: DocumentHistoryService,
    private ticketService: TicketService,
    private assistantService: AssistantService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
  ) {
    this.titleService.setTitle('Base de datos');
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        this.eventCode = Number(eventCode);
        const queryParams = {
          eventCode: Number(this.eventCode),
        };
        // this.router.navigate(['/punto-registro-operador/base-de-datos/historial'], { queryParams: queryParams });
      } else {
        this.router.navigate(['/punto-registro-operador/codigo']);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionAssistant) {
      this.subscriptionAssistant.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.eventService.event.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.eventConfig = data;
        this.eventService.eventEmptyValid(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if(data.status === 'success'){
              if(data.payload){
                this.showMessage = data.payload;
              }
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
        if (this.eventConfig.event.status === 0) {
          const queryParams = {
            eventCode: Number(this.eventCode),
          };
          this.router.navigate(['punto-registro-operador/cerrado'], { queryParams: queryParams })
        }
        this.status = 'success';
        this.assistantService.getAllData(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if (data) {
              this.eventService.assistants$.next(data.payload);
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
        this.documentHistoryService.getByClientIAndEventId(this.eventConfig.event.clientId, this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if (data) {
              this.eventService.documentHistory$.next(data.payload);
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
        this.ticketService.getTicketUserByEvent(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.ticketService.ticketUser$.next(data.payload);
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
        this.subscription = this.documentHistoryService.refresh.subscribe(() => {
          this.documentHistoryService.getByClientIAndEventId(this.eventConfig.event.clientId, this.eventConfig.event.eventId).subscribe({
            next: (data) => {
              if (data) {
                this.eventService.documentHistory$.next(data.payload);
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
          this.assistantService.getAllData(this.eventConfig.event.eventId).subscribe({
            next: (data) => {
              if (data) {
                this.eventService.assistants$.next(data.payload);
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
          this.ticketService.getTicketUserByEvent(this.eventConfig.event.eventId).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                this.ticketService.ticketUser$.next(data.payload);
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
          this.eventService.getRolesByCliente(this.eventConfig.event.clientId).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                this.eventService.roles$.next(data.payload);
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
          this.eventService.quorum$.next({
            coeficiente: 0,
            totalAccessPointTicket: 0,
            totalCoefficienteByTicket: 0,
            totalTickets: 0
          });
          this.eventService.infoEvent$.next({
            apoderadosEnEvento: 0,
            ticketsEnEvento: 0,
            personasEnEvento: 0,
          })
        })
        this.subscriptionAssistant = this.assistantService.refresh.subscribe(() => {
          this.assistantService.getAllData(this.eventConfig.event.eventId).subscribe({
            next: (data) => {
              if (data) {
                this.eventService.assistants$.next(data.payload);
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
        });
      }
    })
  }

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  @HostListener('drop', ['$event']) onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileName = files[0].name;
      this.fileSelected.emit(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.fileName = file.name;
    this.fileSelected.emit(file);
  }
}
