import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../../../../services/event.service';
import { ICreateEvent, IEvent, IUpdateEvent } from '../../../../models/event.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { RequestStatus } from 'src/app/models/request-status.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

interface InputData {
  event: IEvent;
  clientId: number;
  isSave: boolean;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-save-data-event',
  templateUrl: './save-data-event.component.html',
  styleUrls: ['./save-data-event.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      state('out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.4s ease-out')
      ]),
      transition('* => out', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('0.4s ease-in')
      ])
    ])
  ]
})
export class SaveDataEventComponent implements OnInit {

  status: RequestStatus = 'init';
  message: 'Nuevo evento' | 'Editar evento' | '' = '';
  messageButton: 'Crear' | 'Editar' | '' = '';
  event: ICreateEvent = {
    clientId: 0,
    name: '',
    dateStartEvent: '',
    dateEndEvent: '',
  };
  updateEvent: any = {
    clientId: 0,
    name: '',
    dateStartEvent: new Date(),
    dateEndEvent: new Date(),
    eventId: 0
  };
  eventUpdate: IEvent = {
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
  };
  clientId: number = 0;
  dialogAnimationState: 'in' | 'out' = 'in';
  adminUserId: number = 0;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private eventService: EventService,
    private router: Router,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    this.clientId = data.clientId;
    this.adminUserId = data.adminUserId;
    if (data.isSave) {
      this.eventUpdate = data.event;
      this.message = 'Editar evento';
      this.messageButton = 'Editar';
      const fechaInicio = new Date(this.eventUpdate.dateStartEvent);
      const fechaFinal = new Date(this.eventUpdate.dateEndEvent);
      const formattedFechaHoraInicio = `${fechaInicio.getUTCFullYear()}-${this.padNumber(fechaInicio.getUTCMonth() + 1)}-${this.padNumber(fechaInicio.getUTCDate())}T${this.padNumber(fechaInicio.getUTCHours())}:${this.padNumber(fechaInicio.getUTCMinutes())}`;
      const formattedFechaHoraFinal = `${fechaFinal.getUTCFullYear()}-${this.padNumber(fechaFinal.getUTCMonth() + 1)}-${this.padNumber(fechaFinal.getUTCDate())}T${this.padNumber(fechaFinal.getUTCHours())}:${this.padNumber(fechaFinal.getUTCMinutes())}`;
      this.form.patchValue({
        name: this.eventUpdate.name,
        dateStartEvent: formattedFechaHoraInicio,
        dateEndEvent: formattedFechaHoraFinal
      })
    } else {
      this.message = 'Nuevo evento';
      this.messageButton = 'Crear';
    }
  }

  ngOnInit(): void {


  }

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    dateStartEvent: [''],
    dateEndEvent: ['', [Validators.required, this.dateValidator]],
  });

  saveEvent() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, dateStartEvent, dateEndEvent } = this.form.getRawValue();
      this.event = {
        ... this.event,
        clientId: this.clientId,
        name: name,
        dateStartEvent: dateStartEvent,
        dateEndEvent: dateEndEvent,
      }
      if (this.message === 'Nuevo evento') {
        this.eventService.create(this.event).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.status = 'success';
              const queryParams = {
                eventCode: data.payload.codEvent,
              }
              const urlTree = this.router.createUrlTree(['punto-registro-operador/no-configurado'], { queryParams: queryParams });
              const url = this.router.serializeUrl(urlTree);
              this.close();
              window.open(url, '_blank');
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
      } else {
        this.updateEvent = {
          clientId: this.clientId,
          name: name,
          dateStartEvent: dateStartEvent,
          dateEndEvent: dateEndEvent,
          eventId: this.eventUpdate.eventId
        }
        this.eventService.updateEvent(this.updateEvent).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.status = 'success';
              this.toastrService.success('Evento actualizado correctamente');
              this.close();
            } else {
              this.toastrService.info(data.errorMessage.message);
              this.status = 'failed';
            }
          },
          error: (error) => {
            console.error(error);
            this.toastrService.error(environment.messageError);
            this.status = 'failed';
          }
        }
        );
      }

    } else {
      this.form.markAllAsTouched();
    }
  }

  dateValidator(control: { value: Date }): { [key: string]: boolean } | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    if (selectedDate < currentDate) {
      return { 'dateInvalid': true };
    }
    return null;
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }

  padNumber(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
