import { Dialog } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IControl, IControlUser } from 'src/app/models/control.model';
import { OutputData } from 'src/app/models/data.model';
import { IAdminChart, IEventConfig, IQuorumByTime } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { environment } from 'src/environments/environment';
import { MissingControlsComponent } from '../../components/missing-controls/missing-controls.component';
import { QuorumReadingService } from 'src/app/services/quorum-reading.service';
import { Subscription } from 'rxjs';
import { AccessPointService } from 'src/app/services/access-point.service';
import { IAuditoria } from 'src/app/models/access-point.model';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit, OnDestroy {

  status: RequestStatus = 'init';
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
  url: string = '';
  user: IUserAdmin | null = null;
  chartInfoQuorum: IQuorumByTime = {
    hora: [],
    media_hora: [],
    minuto: []
  };
  typeQuorum: number = 1;
  typeTime: 1 | 2 | 3 = 3;
  listControllers: IControlUser[] = [];
  totalEstadoMalos = 0;
  totalEstadoDisponible = 0;
  totalEstadoAsignadosEvento = 0;
  totalEstadoEnUso = 0;
  totalEstadoDevueltos = 0;
  isAdmin: boolean = false;
  href: string = '';
  chartAdmin: IAdminChart[] = [];
  subscription: Subscription;
  listAudit: IAuditoria[] = [];

  constructor(
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toastrService: ToastrService,
    private titleService: Title,
    private quorumReadingService: QuorumReadingService,
    private dialog: Dialog,
    private accessPointService: AccessPointService
  ) {
    this.titleService.setTitle('Reportes');
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        this.eventCode = Number(eventCode);
      } else {
        this.router.navigate(['/punto-registro-operador/codigo']);
      }
    });
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.eventService.event.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.eventConfig = data;
        this.href = `${environment.API_URL}/api/file/downloadExcelAssistanceWeighted/${this.eventConfig.event.eventId}`;
        if (this.eventConfig.event.status === 0) {
          const queryParams = {
            eventCode: Number(this.eventCode),
          };
          this.router.navigate(['punto-registro-operador/cerrado'], { queryParams: queryParams })
        }
        this.accessPointService.getAudit(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if(data.status === 'success'){
              this.listAudit = data.payload;
            }
          },
          error: (error) => {
            console.error(error);
          }
        })
        this.eventService.getQuorumChart(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.chartInfoQuorum = data.payload;
            } else {

            }
          },
          error: (error) => {

          }
        });
        this.eventService.getAdminUserChart(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.chartAdmin = data.payload;
            } else {
              console.error(data.errorMessage.message);
            }
          },
          error: (error) => {
            console.error(error);
          }
        })
        this.status = 'success';
        this.authService.user.subscribe(data => {
          if (data) {
            this.user = data;
            this.url = `${environment.API_URL}/api/file/downloadTotalTicketsWithControl/${this.eventConfig.event.eventId}/${this.user.adminUserId}`;
            this.isAdmin = this.user.idRol.includes(1);
            this.eventService.getControlsByEvent(0).subscribe({
              next: (data) => {
                if (data.status === 'success') {
                  this.listControllers = data.payload;
                  if (this.isAdmin) {
                    this.listControllers = data.payload;
                  } else {
                    this.listControllers = data.payload.filter(item => item.control.lastEvent?.toString() === this.eventConfig.event.eventId.toString());
                  }
                  this.actualizarTotalEstados();
                  this.status = 'success';
                } else {
                  console.error(data.errorMessage.message);
                  this.status = 'failed';
                }
              },
              error: (error) => {
                console.error(error);
                this.status = 'failed';
              }
            });
            this.subscription = this.quorumReadingService.control.subscribe(data => {
              if(data){
                this.eventService.getControlsByEvent(0).subscribe({
                  next: (data) => {
                    if (data.status === 'success') {
                      this.listControllers = data.payload;
                      if (this.isAdmin) {
                        this.listControllers = data.payload;
                      } else {
                        this.listControllers = data.payload.filter(item => item.control.lastEvent?.toString() === this.eventConfig.event.eventId.toString());
                      }
                      this.actualizarTotalEstados();
                      this.status = 'success';
                    } else {
                      console.error(data.errorMessage.message);
                      this.status = 'failed';
                    }
                  },
                  error: (error) => {
                    console.error(error);
                    this.status = 'failed';
                  }
                });
              }
            })
          }
        });
      }
    })
  }

  updateControls() {
    this.dialog.open<OutputData>(DeleteComponent, {
      data: {
        title: '¿Desea volver a disponer todos los controles?',
        messageButton: 'Actualizar',
      }
    }).closed.subscribe(data => {
      if (data?.rta) {
        this.status = 'loading';
        this.eventService.updatesControls().subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.toastrService.success('Controles actualizados correctamente');
              this.status = 'success';
            } else {
              this.toastrService.info(data.errorMessage.message);
              this.status = 'failed';
            }
          },
          error: (error) => {
            console.error(error);
            this.status = 'failed';
          }
        })
      }
    })
  }

  endEvent(){
    const listControlsUse: IControlUser[] = this.listControllers.filter(item => item.control.status == 3);
    this.dialog.open(MissingControlsComponent,{
      data: {
        controls: listControlsUse,
      }
    })
  }

  actualizarTotalEstados() {
    this.totalEstadoMalos = this.listControllers.filter(item => item.control.status == 0).length;
    this.totalEstadoDisponible = this.listControllers.filter(item => item.control.status == 1).length;
    this.totalEstadoAsignadosEvento = this.listControllers.filter(item => item.control.status == 2).length;
    this.totalEstadoEnUso = this.listControllers.filter(item => item.control.status == 3).length;
    this.totalEstadoDevueltos = this.listControllers.filter(item => item.control.status == 5).length;
  }

}
