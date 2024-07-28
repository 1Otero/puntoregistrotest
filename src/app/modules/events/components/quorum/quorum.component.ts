import { Component, Input, OnInit } from '@angular/core';
import { IEvent, InfoEvent } from 'src/app/models/event.model';

@Component({
  selector: 'app-quorum',
  templateUrl: './quorum.component.html',
  styleUrls: ['./quorum.component.scss']
})
export class QuorumComponent implements OnInit {

  @Input() event: IEvent = {
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
  @Input() quorum: number = 0;
  @Input() infoEvent: InfoEvent = {
    apoderadosEnEvento: 0,
    ticketsEnEvento: 0,
    personasEnEvento: 0,
  }
  href: string = '';

  ngOnInit(): void {
    if (this.event) {
      this.href = `quorum`;
    }
  }

}
