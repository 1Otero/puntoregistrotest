import { Component, OnInit, ViewChild, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ITicket, ITicketData } from '../../../../models/ticket.model';
import { TicketService } from '../../../../services/ticket.service';
import { Dialog } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../../environments/environment';
import { IUserAdmin } from '../../../../models/user-admin.model';
import { AuthService } from '../../../../services/auth.service';
import { RequestStatus } from '../../../../models/request-status.model';
import { IEvent } from '../../../../models/event.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { OutputData } from 'src/app/models/data.model';
import { SaveTicketComponent } from '../save-ticket/save-ticket.component';

@Component({
  selector: 'app-ticket-data-base',
  templateUrl: './ticket-data-base.component.html',
  styleUrls: ['./ticket-data-base.component.scss']
})
export class TicketDataBaseComponent implements OnInit, OnDestroy, OnChanges {

  status: RequestStatus = 'init';
  eventId: number = 0;
  listData: MatTableDataSource<ITicketData>;
  displayedColumns: string[] = ['key1', 'key2', 'description', 'coefficient', 'units', 'groupId', 'token', 'active', 'users', 'action'];
  suscription: Subscription;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  searchKeyWrite: string;
  searchKeySelect: string = '0';
  @ViewChild(MatTable) table: MatTable<ITicket>;
  @ViewChild(MatSort) sort: MatSort;
  href = '';
  isOpen: boolean = false;
  clientId: number = environment.clientId;
  adminUser: IUserAdmin | null = null;
  @Input() event: IEvent = {
    eventId: 0,
    modifiedUserId: 0,
    clientId: 0,
    name: '',
    status: 0,
    type: 0,
    date: 0,
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
    dateStartEvent: 0,
    dateEndEvent: 0,
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
  coeficiente: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private dialog: Dialog,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.status = 'loading';
    this.href = `${environment.API_URL}/api/file/downloadTotalTickets/${this.eventId}`;
    this.ticketService.getAllData(this.event.eventId).subscribe({
      next: (data) => {
        console.log(this.event)
        if (data) {
          this.listData = new MatTableDataSource(data.payload);
          this.coeficiente = data.payload.reduce((accumulatedSum, currentValue) => {
            return accumulatedSum + currentValue.ticket.coefficient;
          }, 0);
          this.listData.paginator = this.paginator;
          this.listData.sort = this.sort;
          this.originalFilterPredicate = this.listData.filterPredicate;
          this.status = 'success';
        }
      },
      error: (error) => {
        console.log(error);
        this.status = 'failed';
      }
    });
    this.suscription = this.ticketService.refresh.subscribe(() => {
      this.ticketService.getAllData(this.eventId).subscribe({
        next: (data) => {
          if (data) {
            this.listData = new MatTableDataSource(data.payload);
            this.coeficiente = data.payload.reduce((accumulatedSum, currentValue) => {
              return accumulatedSum + currentValue.ticket.coefficient;
            }, 0);
            this.listData.paginator = this.paginator;
            this.listData.sort = this.sort;
            this.originalFilterPredicate = this.listData.filterPredicate;
            this.status = 'success';
          }
        },
        error: (error) => {
          console.log(error);
          this.status = 'failed';
        }
      });
    });
    this.authService.user.subscribe({
      next: (data) => {
        if (data) {
          this.adminUser = data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  ngOnInit(): void {
  
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  routerDataBaseConfig() {
    this.router.navigate(['app/evento/configuracion-evento', this.eventId, 'base-de-datos']);
  }

  originalFilterPredicate: (data: any, filter: string) => boolean;

  customFilterByKey1() {
    return (data: ITicketData, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return data.ticket.key1.toString().toLowerCase().includes(searchString);
    };
  }

  customFilterByKey2() {
    return (data: ITicketData, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return data.ticket.key2.toString().toLowerCase().includes(searchString);
    };
  }

  customFilterByDescription() {
    return (data: ITicketData, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return data.ticket.description.toString().toLowerCase().includes(searchString);
    };
  }

  customFilterByCoefficient() {
    return (data: ITicketData, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return data.ticket.coefficient.toString().toLowerCase().includes(searchString);
    };
  }

  customFilterByUnits() {
    return (data: ITicketData, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      return data.ticket.units.toString().toLowerCase().includes(searchString);
    };
  }

  customFilterByActive() {
    return (data: ITicketData, filter: string) => {
      const searchString = filter.trim().toLowerCase();
      const result = data.ticket.logdel ? 'Activo' : 'Inactivo';
      return result.toString().toLowerCase().includes(searchString);
    };
  }

  applyFilter() {
    switch (this.searchKeySelect) {
      case '0':
        this.listData.filterPredicate = this.originalFilterPredicate;
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
      case '1':
        this.listData.filterPredicate = this.customFilterByKey1();
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
      case '2':
        this.listData.filterPredicate = this.customFilterByKey2();
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
      case '3':
        this.listData.filterPredicate = this.customFilterByDescription();
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
      case '4':
        this.listData.filterPredicate = this.customFilterByCoefficient();
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
      case '5':
        this.listData.filterPredicate = this.customFilterByUnits();
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
      case '6':
        this.listData.filterPredicate = this.customFilterByActive();
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
      default:
        this.listData.filterPredicate = this.originalFilterPredicate;
        this.listData.filter = this.searchKeyWrite.trim().toLocaleLowerCase();
        break;
    }
  }

  togleSelectAll(event: any) {
    const seleccionar = event.target.checked;
    this.listData.data.forEach((ticket: ITicketData) => {
      ticket.ticket.isSelect = seleccionar;
    });
    this.table.renderRows();
  }

  onDelete(ticketId: number) {
    this.dialog.open<OutputData>(DeleteComponent).closed.subscribe(data => {
      if (data?.rta) {
        this.ticketService.delete(ticketId, '').subscribe(data => {
          if (data) {
            this.toastrService.success('Registro eliminado');
          }
        });
      }
    })
  }

  onCreate() {
    this.dialog.open(SaveTicketComponent, {
      data: {
        ticket: null,
        isSave: false,
        eventId: this.eventId,
        clientId: this.clientId,
        isFree: this.event.freeEvent === 1 && this.listData.data.length < 30,
        numberIsFree: this.event.freeEvent,
      }
    });
  }

  onEdit(ticket: ITicket) {
    delete ticket.isOpen;
    delete ticket.isSelect;
    this.dialog.open(SaveTicketComponent, {
      data: {
        ticket: ticket,
        isSave: true,
        eventId: 0,
        clientId: 0,
        isFree:true,
        numberIsFree: this.event.freeEvent,
      }
    });
  }

}
