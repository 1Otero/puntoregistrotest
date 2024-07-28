import { Component, Input } from '@angular/core';
import { IEventConfig } from 'src/app/models/event.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { environment } from 'src/environments/environment';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from '@angular/cdk/dialog';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { OutputData } from 'src/app/models/data.model';
import { Router } from '@angular/router';
import { SaveDataEventComponent } from '../save-data-event/save-data-event.component';

@Component({
  selector: 'app-grid-event',
  templateUrl: './grid-event.component.html',
  styleUrls: ['./grid-event.component.scss']
})
export class GridEventComponent {

  @Input() event: IEventConfig = {
    event: {
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
  typeRoute: number = 0;

  constructor(
    private eventService: EventService,
    private toastrService: ToastrService,
    private dialog: Dialog,
    private router: Router,
  ) { }


  onEvent() {
    if (this.event.event.codEvent !== 0) {
      const queryParams = {
        eventCode: this.event.event.codEvent,
      }
      if (this.event.event.status === 1) {
        if (this.event.configRegistrationPoint) {
          this.eventService.eventEmptyValid(this.event.event.eventId).subscribe({
            next: (data) => {
              if(data.status === 'success'){
                if(!data.payload){
                  this.typeRoute = 1;
                  const urlTree = this.router.createUrlTree(['punto-registro-operador/evento'], { queryParams: queryParams });
                  const url = this.router.serializeUrl(urlTree);
                  window.open(url, '_blank');
                } else {
                  this.typeRoute = 1;
                  const urlTree = this.router.createUrlTree(['punto-registro-operador/base-de-datos/historial'], { queryParams: queryParams });
                  const url = this.router.serializeUrl(urlTree);
                  window.open(url, '_blank');
                }
              } else {
                this.toastrService.info(data.errorMessage.message);
              }
            },
            error: (error) => {
              console.error(error);
              this.toastrService.error(environment.messageError);
            }
          })
        } else {
          this.typeRoute = 2;
          const urlTree = this.router.createUrlTree(['punto-registro-operador/no-configurado'], { queryParams: queryParams });
          const url = this.router.serializeUrl(urlTree);
          window.open(url, '_blank');
        }
      } else {
        this.typeRoute = 3;
        const urlTree = this.router.createUrlTree(['punto-registro-operador/cerrado'], { queryParams: queryParams });
        const url = this.router.serializeUrl(urlTree);
        window.open(url, '_blank');
      }
    } else {
      this.toastrService.info('El evento no cuenta con código');
    }
  }

  isOpen: boolean = false;

  onClose() {
    this.isOpen = false;
    this.dialog.open<OutputData>(DeleteComponent,
      {
        data: {
          title: '¿Está seguro que desea cerrar el evento?'
        }
      }
    ).closed.subscribe(data => {
      if (data?.rta) {
        this.eventService.delete(this.event.event.eventId).subscribe({
          next: (data) => {

          }
        })
      }
    })
  }

  onEdit() {
    this.dialog.open(SaveDataEventComponent,
      {
        data: {
          event: this.event.event,
          isSave: true,
          clientId: this.event.event.clientId
        }
      }
    )
  }

  onActive() {
    this.isOpen = false;
    this.eventService.delete(this.event.event.eventId).subscribe({
      next: (data) => {

      }
    })
  }

  onPreregister() {
    const queryParams = {
      eventId: this.event.event.eventId,
    }
    const urlTree = this.router.createUrlTree(['punto-registro-operador/configuracion-evento'], { queryParams: queryParams });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  onPreregisterUser() {
    const queryParams = {
      eventCode: this.event.event.codEvent,
    }
    const urlTree = this.router.createUrlTree(['preregistro/registro'], { queryParams: queryParams });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }
}
