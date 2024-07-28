import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IEventConfig, InfoEvent } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.component.html',
  styleUrls: ['./exit.component.scss']
})
export class ExitComponent {

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
  infoEvent: InfoEvent = {
    apoderadosEnEvento: 0,
    ticketsEnEvento: 0,
    personasEnEvento: 0,
  }
  eventCode: number = 0;
  selectedOption: string | null = localStorage.getItem('selectedOptionExit');
  quorum: number = 0;
  message: string = '';

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {
    this.titleService.setTitle('Salida');
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        this.eventCode = Number(eventCode);
      } else {
        this.router.navigate(['/punto-registro-operador/codigo']);
      }
    });
  }

  ngOnInit(): void {
    this.eventService.event.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.eventConfig = data;
        if(this.eventConfig.event.status === 0){
          const queryParams = {
            eventCode: Number(this.eventCode),
          };
          this.router.navigate(['punto-registro-operador/cerrado'],{ queryParams: queryParams })
        }
        if (!this.eventConfig.configRegistrationPoint) {
          this.router.navigate(['punto-registro-operador/no-configurado']);
        }
      }
      this.status = 'success';
    });
    this.eventService.quorum.subscribe(data => {
      if (data) {
        this.quorum = data.coeficiente;
      }
    });
    this.eventService.infoEvent.subscribe(data => {
      if (data) {
        this.infoEvent = data;
      }
    })
    if (!this.selectedOption) {
      this.selectedOption = 'control';
      localStorage.setItem('selectedOptionExit', this.selectedOption);
    }
  }

  selectOption(option: string) {
    this.selectedOption = option;
    localStorage.setItem('selectedOptionExit', option);
  }

  onMessage(message: string) {
    if (this.message === '') {
      this.message = message;
    } else {
      this.message = '';
      setTimeout(() => {
        this.message = message;
      }, 500);
    }
  }

}
