import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { RequestStatus } from 'src/app/models/request-status.model';
import { ITicket } from 'src/app/models/ticket.model';
import { EventService } from 'src/app/services/event.service';
import { SaveTicketComponent } from '../../components/save-ticket/save-ticket.component';
import { IEventConfig } from 'src/app/models/event.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { OutputData } from 'src/app/models/data.model';
import { TicketService } from 'src/app/services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { FileComponent } from '../../components/file/file.component';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  status: RequestStatus = 'init';
  listTickets: ITicket[] = [];
  totalPages: number = 0;
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  displayedTickets: ITicket[] = [];
  typeFilter: string = '0';
  writeFilter: string = '';
  sortedData: ITicket[];
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
  isOpen: boolean = false;
  user: IUserAdmin | null = null;

  constructor(
    private eventService: EventService,
    private dialog: Dialog,
    private ticketService: TicketService,
    private toastrService: ToastrService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.authService.user.subscribe(data => {
      if(data){
        this.user = data;
      }
    })
    this.eventService.tickets.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.listTickets = data;
        this.status = 'success';
        this.updateDisplayedTickets();
      }
    });
    this.eventService.event.subscribe(data => {
      if (data) {
        this.eventConfig = data;
        this.url = `${environment.API_URL}/api/file/downloadTotalTickets/${this.eventConfig.event.eventId}`;
      }
    })
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.listTickets.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedTickets();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedTickets();
    }
  }

  changePageSize() {
    const firstItemIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentPage = Math.floor(firstItemIndex / this.itemsPerPage) + 1;
    this.updateTotalPages();
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    this.updateDisplayedTickets();
  }

  updateDisplayedTickets() {
    let filteredItems = this.listTickets;
    if (this.typeFilter !== '0') {
      filteredItems = filteredItems.filter((item: ITicket) => {
        switch (this.typeFilter) {
          case '1':
            return item.key1.toLowerCase().includes(this.writeFilter.toLowerCase()) || item.key2.toLowerCase().includes(this.writeFilter.toLowerCase());
          case '2':
            return (item.coefficient.toString()).toLowerCase().includes(this.writeFilter.toLowerCase());
          case '3':
            return (item.units.toString()).toLowerCase().includes(this.writeFilter.toLowerCase());
          case '4':
            return item.groupId.toLowerCase().includes(this.writeFilter.toLowerCase());
          case '5':
            return (item.numControl === 0 ? '' : item.numControl.toString()).toLowerCase().includes(this.writeFilter.toLowerCase());
          default:
            return true;
        }
      });
    }
    if (this.typeFilter === '0' && this.writeFilter.trim() !== '') {
      const filterValue = this.writeFilter.toLowerCase().trim();
      filteredItems = filteredItems.filter((item: ITicket) =>
        item.key1?.toString().toLowerCase().includes(filterValue) ||
        item.key2?.toString().toLowerCase().includes(filterValue) ||
        item.coefficient?.toString().toLowerCase().includes(filterValue) ||
        item.units?.toString().toLowerCase().includes(filterValue) ||
        item.groupId?.toLowerCase().includes(filterValue) ||
        (item.numControl === 0 ? '' : item.numControl.toString()).toLowerCase().includes(filterValue)
      );
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, filteredItems.length);
    this.displayedTickets = filteredItems.slice(startIndex, endIndex);
    this.updateTotalPages();
  }

  sortData(sort: Sort) {
    const data = this.displayedTickets;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'key':
          return compare((a.key1 + ' - ' + a.key2), (b.key1 + ' - ' + b.key2), isAsc);
        case 'coeficiente':
          return compare(a.coefficient, b.coefficient, isAsc);
        case 'unidades':
          return compare(a.units, b.units, isAsc);
        case 'grupo':
          return compare(a.groupId, b.groupId, isAsc);
        case 'control':
          return compare(a.numControl, b.numControl, isAsc);
        default:
          return 0;
      }
    });
  }

  onCreate() {
    this.dialog.open(SaveTicketComponent, {
      data: {
        ticket: null,
        isSave: false,
        eventId: this.eventConfig.event.eventId,
        clientId: this.eventConfig.event.clientId,
        isFree: false,
        numberIsFree: 1,
        deviceType: this.eventConfig.configRegistrationPoint.deviceType,
      }
    })
  }

  onEdit(ticket: ITicket) {
    delete ticket.isOpen;
    delete ticket.isSelect;
    this.dialog.open(SaveTicketComponent, {
      data: {
        ticket: ticket,
        isSave: true,
        eventId: this.eventConfig.event.eventId,
        clientId: this.eventConfig.event.clientId,
        isFree: false,
        numberIsFree: 1,
        deviceType: this.eventConfig.configRegistrationPoint.deviceType,
      }
    })
  }

  onActive(ticket: ITicket) {
    delete ticket.isOpen;
    delete ticket.isSelect;
    this.dialog.open<OutputData>(DeleteComponent, {
      data: {
        title: '¿Está seguro que desea ' + (ticket.status === 0 ? 'activar' : 'inactivar') + ' este ticket?',
        messageButton: (ticket.status === 0 ? 'Activar' : 'Inactivar')
      }
    }).closed.subscribe(data => {
      if (data?.rta) {
        ticket = {
          ...ticket,
          status: ticket.status === 0 ? 1 : 0
        }
        this.ticketService.update(ticket).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.toastrService.success('Ticket ' + (data.payload.status === 1 ? 'activado' : 'inactivado') + ' correctamente');
            } else {
              this.toastrService.info(data.errorMessage.message);
            }
          },
          error: (error) => {
            console.error(error);
            this.toastrService.error(environment.messageError);
          }
        })
      }
    });
  }

  onDelete(ticket: ITicket) {
    delete ticket.isOpen;
    delete ticket.isSelect;
    this.dialog.open<OutputData>(DeleteComponent, {
      data: {
        title: '¿Está seguro que desea eliminar el ticket ' + ticket.key1 + ' - ' + ticket.key2 + '?',
      }
    }).closed.subscribe(data => {
      if (data?.rta) {

      }
    })
  }

  chargeTickets() {
    this.dialog.open(FileComponent,
      {
        data: {
          clientId: this.eventConfig.event.clientId,
          eventId: this.eventConfig.event.eventId,
          adminUserId: this.user?.adminUserId,
          rta: 'ticket',
        }
      }
    )
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
