import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IEvent, IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-code',
  templateUrl: './event-code.component.html',
  styleUrls: ['./event-code.component.scss']
})
export class EventCodeComponent {

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
      codEvent: 0,
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
  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private toastrService: ToastrService,
    private router: Router,
  ) { }

  form = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required]],
  });

  ingress() {
    if (this.form.valid) {
      this.status = 'loading';
      const { code } = this.form.getRawValue();
      this.eventService.getByCode(Number(code)).subscribe({
        next: (data) => {
          if (data.payload) {
            this.eventConfig = data.payload;
            this.toastrService.success(this.eventConfig.event.name);
            const queryParams = {
              eventCode: Number(code),
            };
            if(this.eventConfig.event.status === 0){
              const queryParams = {
                eventCode: Number(code),
              };
              this.router.navigate(['punto-registro-operador/cerrado'],{ queryParams: queryParams })
            } else {
              if(this.eventConfig.configRegistrationPoint){
                this.router.navigate(['punto-registro-operador/evento'], { queryParams: queryParams });
              } else {
                this.router.navigate(['punto-registro-operador/no-configurado'], { queryParams: queryParams });
              }
            }
            this.status = 'success';
          } else {
            this.toastrService.info('El evento no se encuentra disponible');
            this.status = 'failed';
          }
        },
        error: () => {
          this.status = 'failed';
          this.toastrService.error('Algo anda mal, inténtalo de nuevo más tarde');
        }
      });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
