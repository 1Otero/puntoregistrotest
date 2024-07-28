import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IConfig, IConfigRegistrationPoint, IEvent, IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { InfoVariableService } from 'src/app/services/info-variable.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit, OnDestroy {

  status: RequestStatus = 'init';
  statusSave: RequestStatus = 'init';
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
  listConfig: IConfigRegistrationPoint[] = [];
  subscription: Subscription;
  shoAnimation: boolean = false;

  configRegistrationPointUpdate: IConfig = {
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

  eventCode: number = 0;

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private infoVariableService: InfoVariableService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Configuración')
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        this.eventCode = Number(eventCode);
      } else {
        this.router.navigate(['/punto-registro-operador/codigo']);
      }
    });
  }


  form = this.formBuilder.group({
    tipoEvento: [''],
    tipoDispositivo: [''],
    tipoVotacion: [''],
    escarapela: [''],
    infoCliente: [''],
    email: [true],
    phone: [true],
    nominal: [true],
    coefficient: [true],
    units: [true]
  });

  ngOnInit(): void {
    this.eventService.event.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.eventConfig = data;
        if (this.eventConfig.event.status === 0) {
          const queryParams = {
            eventCode: Number(this.eventCode),
          };
          this.router.navigate(['punto-registro-operador/cerrado'], { queryParams: queryParams })
        }
        this.status = 'success';
        this.form.patchValue({
          tipoEvento: this.eventConfig.configRegistrationPoint.isPublic ? '1' : '0',
          tipoDispositivo: this.eventConfig.configRegistrationPoint.deviceType === 1 ? '1' : '0',
          tipoVotacion: this.eventConfig.configRegistrationPoint.vottingType === 1 ? '1' : '0',
          escarapela: this.eventConfig.configRegistrationPoint.print === 1 ? '1' : '0',
          infoCliente: this.eventConfig.configRegistrationPoint.showInfoClient === 1 ? '1' : '0',
          email: this.eventConfig.configRegistrationPoint.email === 1 ? true : false,
          phone: this.eventConfig.configRegistrationPoint.phone === 1 ? true : false,
          nominal: this.eventConfig.configRegistrationPoint.nominal === 1 ? true : false,
          coefficient: this.eventConfig.configRegistrationPoint.coefficient === 1 ? true : false,
          units: this.eventConfig.configRegistrationPoint.units === 1 ? true : false,
        });
        this.shoAnimation = this.eventConfig.configRegistrationPoint.showInfoClient === 1 ? true : false;
        this.eventService.getInfoVariable(this.eventConfig.event.eventId, 'pointRegister').subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.listConfig = data.payload;
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
        this.subscription = this.infoVariableService.refresh.subscribe(() => {
          this.eventService.getInfoVariable(this.eventConfig.event.eventId, 'pointRegister').subscribe({
            next: (data) => {
              if (data.status === 'success') {
                this.listConfig = data.payload;
              }
            },
            error: (error) => {
              console.error(error);
            }
          });
        })
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.statusSave = 'loading';
      const { tipoEvento, tipoDispositivo, tipoVotacion, escarapela, infoCliente, email, phone, nominal, coefficient, units } = this.form.getRawValue();
      this.configRegistrationPointUpdate = {
        ... this.configRegistrationPointUpdate,
        configRegistrationPointId: this.eventConfig.configRegistrationPoint.configRegistrationPointId,
        eventId: this.eventConfig.event.eventId,
        isPublic: tipoEvento === '1' ? 1 : 0,
        deviceType: Number(tipoDispositivo),
        vottingType: Number(tipoVotacion),
        print: Number(escarapela),
        showInfoClient: Number(infoCliente),
        email: email ? 1 : 0,
        phone: phone ? 1 : 0,
        nominal: nominal ? 1 : 0,
        coefficient: coefficient ? 1 : 0,
        units: units ? 1 : 0,
      }
      this.eventService.updateConfigEvent(this.configRegistrationPointUpdate).subscribe({
        next: (data) => {
          if (data) {
            this.toastrService.success('Actualizado correctamente');
            this.eventConfig.configRegistrationPoint = this.configRegistrationPointUpdate;
            this.statusSave = 'success';
          }
        },
        error: (error) => {
          console.error(error);
          this.statusSave = 'failed';
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  onChange(event: any) {
    if (event.value === '1') {
      this.shoAnimation = event.value === '1';
    } else {
      setTimeout(() => {
        this.shoAnimation = false;
      }, 500);
    }
  }
}
