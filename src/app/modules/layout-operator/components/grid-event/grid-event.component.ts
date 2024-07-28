import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IEvent } from 'src/app/models/event.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-grid-event',
  templateUrl: './grid-event.component.html',
  styleUrls: ['./grid-event.component.scss']
})
export class GridEventComponent implements OnInit{

  @Input() event: IEvent = {
    eventId: 0,
    modifiedUserId: 0,
    clientId: 0,
    name: '',
    status: 1,
    type: 0,
    date: Date.now(),
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
    active: true,
    dateStartEvent: Date.now(),
    dateEndEvent: Date.now(),
    selectEvent: true,
    vottingTypeId: 0,
    dataBase: false,
    preregistration: false,
    registrationPoint: false,
    app: false,
    videoCall: false,
    typeEvent: 0,
    date2: 0,
    freeEvent: 0,
    codEvent: 0
  }
  @Input() user: IUserAdmin = {
    adminUserId: 0,
    name: 'Robinson',
    lastName: 'Gutiérrez',
    email: '',
    phoneNumber: '',
    password: '',
    country: '',
    city: '',
    createDate: new Date(),
    modifiedDate: new Date(),
    modifiedUserId: 0,
    idRol: []
  }
  url: string = '';
  
  constructor(
    private router: Router,
    private dialog: Dialog,
    private eventService: EventService,
    private authService: AuthService
  ){}

  ngOnInit(): void {
    this.url = `${environment.site}/app/${this.event.eventId}/login`;
    this.authService.user$.subscribe(data => {
      if(data){
        this.user = data;
      }
    })
  }

  isOpen: boolean = false;

  onConfiguration(){
    this.router.navigate(['initial/home/eventos/'+ this.event.eventId]);
  }

  onClose(){
    this.isOpen = false;
    this.eventService.delete(this.event.eventId).subscribe({
      next: (data) => {
        
      }
    })
  }

}
