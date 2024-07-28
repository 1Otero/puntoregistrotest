import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IControl, IControlUser } from 'src/app/models/control.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { EventService } from 'src/app/services/event.service';
import { ToastrService } from 'ngx-toastr';
import { IEventConfig } from 'src/app/models/event.model';
import { Dialog } from '@angular/cdk/dialog';
import { CreateControlComponent } from '../../components/create-control/create-control.component';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { OutputData } from 'src/app/models/data.model';
import { environment } from 'src/environments/environment';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { QuorumReadingService } from 'src/app/services/quorum-reading.service';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {

  status: RequestStatus = 'init';
  listControllers: IControlUser[] = [];
  listControllersFilter: IControlUser[] = [];
  numeroColumnas = 10;
  busqueda = '';
  totalEstadoMalos = 0;
  totalEstadoDisponible = 0;
  totalEstadoAsignadosEvento = 0;
  totalEstadoEnUso = 0;
  totalEstadoDevueltos = 0;
  eventCode: number = 0;
  isOpen: boolean = false;
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
  user: IUserAdmin | null = null;
  isAdmin: boolean = false;
  totalControlDisponibleEvento: number = 0;
  totalControlEnUsoEvento: number = 0;
  totalFaltanEvento: number = 0;
  totalDevueltosEvento: number = 0;
  subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventService: EventService,
    private titleService: Title,
    private toastrService: ToastrService,
    private dialog: Dialog,
    private authService: AuthService,
    private quorumReadingService: QuorumReadingService,
  ) {
    this.titleService.setTitle('Controles');
    this.route.queryParamMap.subscribe(params => {
      const eventCode = params.get('eventCode');
      if (eventCode) {
        this.eventCode = Number(eventCode);
      } else {
        this.router.navigate(['/punto-registro-operador/codigo']);
      }
    });
  }

  ngOnInit(): void {
    this.authService.user.subscribe(data => {
      if (data) {
        this.status = 'loading';
        this.user = data;
        this.isAdmin = this.user.idRol.includes(1);
        this.eventService.event.subscribe(data => {
          if (data) {
            this.eventConfig = data;
            this.eventService.getControlsByEvent(0).subscribe({
              next: (data) => {
                if (data.status === 'success') {
                  if (this.isAdmin) {
                    this.listControllers = data.payload;
                    this.listControllersFilter = [... this.listControllers];
                  } else {
                    this.listControllers = data.payload.filter(item => item.control.lastEvent?.toString() === this.eventConfig.event.eventId.toString());
                    this.listControllersFilter = [... this.listControllers];
                  }
                  this.actualizarTotalEstados();
                  this.filtrarArreglo();
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
                      if (this.isAdmin) {
                        this.listControllers = data.payload;
                        this.listControllersFilter = [... this.listControllers];
                      } else {
                        this.listControllers = data.payload.filter(item => item.control.lastEvent?.toString() === this.eventConfig.event.eventId.toString());
                        this.listControllersFilter = [... this.listControllers];
                      }
                      this.actualizarTotalEstados();
                      this.filtrarArreglo();
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
            });
          }
        })
      }
    })
  }

  filtrarArreglo() {
    if (this.busqueda == '') {
      this.listControllersFilter = [... this.listControllers];
      this.actualizarTotalEstados();
    } else {
      let valores: string[] | number[] = this.busqueda.split(/[-,]/);
      valores = valores.map(x => Number(x));
      this.listControllersFilter = this.listControllers.filter(item => {
        if (valores.some(x => x === item.control.keyControl)) {
          return true;
        }
        for (let i = 0; i < valores.length - 1; i++) {
          if (this.busqueda.includes(`${valores[i]}-${valores[i + 1]}`)) {
            if (Number(valores[i]) < Number(valores[i + 1]) && item.control.keyControl >= Number(valores[i]) && item.control.keyControl <= Number(valores[i + 1])) {
              return true;
            }
            i++;
          }
        }
        return false;
      });
      this.actualizarTotalEstados();
    }
  }

  actualizarTotalEstados() {
    this.totalEstadoMalos = this.listControllersFilter.filter(item => item.control.status == 0).length;
    this.totalEstadoDisponible = this.listControllersFilter.filter(item => item.control.status == 1).length;
    this.totalEstadoAsignadosEvento = this.listControllersFilter.filter(item => item.control.lastEvent).length;
    this.totalEstadoEnUso = this.listControllersFilter.filter(item => item.control.status == 3).length;
    this.totalEstadoDevueltos = this.listControllersFilter.filter(item => item.control.status == 5).length;
    // Totales con evento
    this.totalControlDisponibleEvento = this.listControllersFilter.filter(item => item.control.lastEvent && item.control.status === 2).length;
    this.totalControlEnUsoEvento = this.listControllersFilter.filter(item => item.control.lastEvent && item.control.status === 3).length;
    this.totalFaltanEvento = (this.totalControlEnUsoEvento + this.totalDevueltosEvento) - this.totalDevueltosEvento;
    this.totalDevueltosEvento = this.listControllersFilter.filter(item => item.control.lastEvent && item.control.status === 5).length;
  }

  onNumeroColumnasChange() {
    if (this.numeroColumnas < 2) {
      this.numeroColumnas = 2;
    } else if (this.numeroColumnas > 18) {
      this.numeroColumnas = 18;
    }
  }

  assignEvent() {
    this.dialog.open<OutputData>(DeleteComponent, {
      data: {
        title: '¿Está seguro que desea asignar estos controles a este evento?',
        messageButton: 'Asignar'
      }
    }).closed.subscribe(data => {
      if (data?.rta) {
        this.status = 'loading';
        let controlIds: number[] = [];
        this.listControllersFilter.map(item => {
          controlIds.push(item.control.idControl);
        });
        this.eventService.assingControlToEvent(controlIds, this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.listControllersFilter.map((item, index) => {
                this.listControllers[index].control.status = 2;
              });
              this.toastrService.success('Asignados correctamente');
              this.actualizarTotalEstados();
              this.status = 'success';
            } else {
              this.toastrService.error(data.errorMessage.message);
              this.status = 'failed';
            }
          },
          error: (error) => {
            console.error(error);
            this.toastrService.error(environment.messageError);
            this.status = 'failed';
          }
        })
      }
    })

  }

  onControl(control: IControl) {
    const index = this.listControllers.findIndex(item => item.control.idControl === control.idControl);
    if (index !== -1) {
      this.listControllers[index].control.status = control.status;
      this.listControllers[index].control.physicalState = control.physicalState;
      this.actualizarTotalEstados();
    }
  }

  onCreateControl() {
    this.dialog.open<any>(CreateControlComponent).closed.subscribe(data => {
      if (data.rta) {
        this.listControllers.push(data.control);
        this.listControllersFilter = this.listControllers;
        this.actualizarTotalEstados();
      }
    });
  }

}
