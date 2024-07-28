import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IDataQuorum, IEventConfig } from 'src/app/models/event.model';
import { IQuorumReading, IQuorumReadingByUser } from 'src/app/models/quorum-reading.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { EventService } from 'src/app/services/event.service';
import { QuorumReadingService } from 'src/app/services/quorum-reading.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-info-quorum',
  templateUrl: './quorum.component.html',
  styleUrls: ['./quorum.component.scss']
})
export class QuorumInfoComponent implements OnInit, OnDestroy {

  status: RequestStatus = 'init';
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
  quorum: IDataQuorum = {
    coeficiente: 0,
    totalAccessPointTicket: 0,
    totalCoefficienteByTicket: 0,
    totalTickets: 0
  };
  currentTime: Date = new Date();
  quorumReading: IQuorumReadingByUser[] = [];
  subscription: Subscription;

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private quorumReadingService: QuorumReadingService,
    private toastrService: ToastrService,
  ) {
    titleService.setTitle('Quórum');
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        this.eventCode = Number(eventCode);
      } else {
        this.router.navigate(['/punto-registro-operador/codigo']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.eventService.event.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.eventConfig = data;
        this.quorumReadingService.get(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.quorumReading = data.payload;
              this.status = 'success';
            } else {
              this.status = 'failed';
            }
          },
          error: (error) => {
            console.error(error);
            this.status = 'failed';
          }
        });
        this.subscription = this.quorumReadingService.refresh.subscribe(() => {
          this.quorumReadingService.get(this.eventConfig.event.eventId).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                this.quorumReading = data.payload;
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
        });
        if (this.eventConfig.event.status === 0) {
          const queryParams = {
            eventCode: Number(this.eventCode),
          };
          this.router.navigate(['punto-registro-operador/cerrado'], { queryParams: queryParams })
        }
      }
    });
    this.eventService.quorum.subscribe(data => {
      if (data) {
        this.quorum = data;
      }
    });
    setInterval(() => {
      this.currentTime = new Date();
    }, 1000);
  }

  saveQuorumReading() {
    this.status = 'loading';
    const quorumReading: IQuorumReading = {
      quorumReadingId: 0,
      eventId: this.eventConfig.event.eventId,
      coefficient: 0,
      units: 0,
      date: 0,
      status: 0,
      logdel: 0,
    }
    this.quorumReadingService.create(quorumReading).subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.toastrService.success('Quorum registrado correctamente');
          this.status = 'success';
        } else {
          this.status = 'failed';
          this.toastrService.info(data.errorMessage.message);
        }
      },
      error: (error) => {
        console.error(error);
        this.status = 'failed';
        this.toastrService.error(environment.messageError);
      }
    })
  }

  onBakc() {
    const queryParams = {
      eventCode: Number(this.eventCode),
    };
    this.router.navigate(['punto-registro-operador/evento'], { queryParams: queryParams });
  }

}
