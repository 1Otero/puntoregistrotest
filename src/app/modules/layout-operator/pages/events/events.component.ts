import { Component, OnInit } from '@angular/core';
import { IEvent } from '../../../../models/event.model';
import { IUserAdmin } from '../../../../models/user-admin.model';
import { Subscription } from 'rxjs';
import { RequestStatus } from '../../../../models/request-status.model';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent {

  constructor(
    private titleService: Title
  ) { 
    this.titleService.setTitle('Código evento');
  }

}
