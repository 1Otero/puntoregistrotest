import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IConfig, IConfigRegistrationPoint, IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { InfoVariableService } from 'src/app/services/info-variable.service';

@Component({
  selector: 'app-no-configure',
  templateUrl: './no-configure.component.html',
  styleUrls: ['./no-configure.component.scss']
})
export class NoConfigureComponent implements OnInit {

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
  };
  eventCode: number = 0;
  status: RequestStatus = 'init';
  statusSave: RequestStatus = 'init';
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
  user: IUserAdmin | null = null;
  isAdmin: boolean = false;
  subscription: Subscription;
  shoAnimation: boolean = false;
  listConfig: IConfigRegistrationPoint[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private authService: AuthService,
    private infoVariableService: InfoVariableService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Configuración');
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
    this.authService.user.subscribe(data => {
      if (data) {
        this.isAdmin = data.idRol.includes(1);
      }
    })
  }

  onSubmit() {
    if (this.form.valid) {
      this.statusSave = 'loading';
      const { tipoEvento, tipoDispositivo, tipoVotacion, escarapela, email, phone, nominal, coefficient, units } = this.form.getRawValue();
      this.configRegistrationPointUpdate = {
        ... this.configRegistrationPointUpdate,
        configRegistrationPointId: this.eventConfig.configRegistrationPoint ? this.eventConfig.configRegistrationPoint.configRegistrationPointId : 0,
        eventId: this.eventConfig.event.eventId,
        isPublic: tipoEvento === '1' ? 1 : 0,
        deviceType: Number(tipoDispositivo),
        vottingType: Number(tipoVotacion),
        print: Number(escarapela),
        email: email ? 1 : 0,
        phone: phone ? 1 : 0,
        nominal: nominal ? 1 : 0,
        coefficient: coefficient ? 1 : 0,
        units: units ? 1 : 0,
      }
      if (this.eventConfig.configRegistrationPoint) {
        this.eventService.updateConfigEvent(this.configRegistrationPointUpdate).subscribe({
          next: (data) => {
            if (data) {
              this.toastrService.success('Registrado correctamente');
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
        this.eventService.createConfigEvent(this.configRegistrationPointUpdate).subscribe({
          next: (data) => {
            if (data) {
              this.toastrService.success('Registrado correctamente');
              const queryParams = {
                eventCode: Number(this.eventCode),
              };
              this.router.navigate(['punto-registro-operador/base-de-datos/historial'], { queryParams: queryParams });
              this.eventConfig.configRegistrationPoint = this.configRegistrationPointUpdate;
              this.statusSave = 'success';
            }
          },
          error: (error) => {
            console.error(error);
            this.statusSave = 'failed';
          }
        })
      }
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

  onBack() {
    this.router.navigate(['punto-registro-operador/codigo']);
  }

}
