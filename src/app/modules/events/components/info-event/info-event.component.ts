import { Component, Input } from '@angular/core';
import { IConfig } from 'src/app/models/event.model';

@Component({
  selector: 'app-info-event',
  templateUrl: './info-event.component.html',
  styleUrls: ['./info-event.component.scss']
})
export class InfoEventComponent {

  @Input() date: number = 0;

  @Input() config: IConfig = {
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
