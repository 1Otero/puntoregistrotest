import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IEventConfig } from 'src/app/models/event.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-preregister',
  templateUrl: './preregister.component.html',
  styleUrls: ['./preregister.component.scss']
})
export class PreregisterComponent {

  eventCode: number = 0;
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Preregistro');
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        this.eventCode = Number(eventCode);
        this.eventService.getByCode(this.eventCode).subscribe({
          next: (data) => {
            if (data.payload) {
              this.eventConfig = data.payload;
              this.eventService.event$.next(this.eventConfig);
              if (data.payload.event.status === 0) {
                const queryParams = {
                  eventCode: Number(this.eventCode),
                };
                this.router.navigate(['punto-registro-operador/cerrado'], { queryParams: queryParams })
              }
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
      } else {
        alert('Redireccionar')
      }
    });
  }

}
