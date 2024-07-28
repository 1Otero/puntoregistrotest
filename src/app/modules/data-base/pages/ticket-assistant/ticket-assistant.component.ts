import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { IAssistantDataWithTickets, ITicketUserData } from 'src/app/models/assistant.model';
import { OutputData } from 'src/app/models/data.model';
import { IClientRoles, IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { ITicket, ITicketUser } from 'src/app/models/ticket.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { EventService } from 'src/app/services/event.service';
import { TicketService } from 'src/app/services/ticket.service';
import { environment } from 'src/environments/environment';
import { SaveAssistantTicketComponent } from '../../components/save-assistant-ticket/save-assistant-ticket.component';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';
import { FileComponent } from '../../components/file/file.component';

interface TicketUser {
  key: string,
  descripcion: string,
  usuario: string,
  rol: string,
  nombre: string,
  isOpen: boolean;
}

@Component({
  selector: 'app-ticket-assistant',
  templateUrl: './ticket-assistant.component.html',
  styleUrls: ['./ticket-assistant.component.scss']
})
export class TicketAssistantComponent {

  status: RequestStatus = 'init';
  listTickets: ITicketUserData[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  totalPages: number = 0;
  displayedTickets: TicketUser[] = [];
  typeFilter: string = '0';
  writeFilter: string = '';
  sortedData: TicketUser[];
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
  listTicketsThis: TicketUser[];
  url: string = '';
  isOpen: boolean = false;
  listTickects: ITicket[] = [];
  listUsers: IAssistantDataWithTickets[] = [];
  roles: IClientRoles[] = [];
  user: IUserAdmin | null = null;

  constructor(
    private eventService: EventService,
    private ticketService: TicketService,
    private dialog: Dialog,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.ticketService.ticketUser.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.listTickets = data;
        this.listTicketsThis = [];
        this.listTickets.map(user => {
          if (user.ticketsByUserWithRole) {
            user.ticketsByUserWithRole.map(tikets => {
              let ticket: TicketUser = {
                key: tikets.ticket.key1 + ' - ' + tikets.ticket.key2,
                descripcion: tikets.ticket.description,
                usuario: user.userAssistant.docId,
                rol: tikets.rol,
                nombre: user.userAssistant.firstName + ' ' + user.userAssistant.lastName,
                isOpen: false,
              };
              this.listTicketsThis.push(ticket);
            })
          }
        });
        this.status = 'success';
        this.updateDisplayedTickets();
      }
    });
    this.eventService.event.subscribe(data => {
      if (data) {
        this.eventConfig = data;
        this.url = `${environment.API_URL}/api/file/downloadExcelTicketUsers/${this.eventConfig.event.eventId}`;
      }
    });
    this.eventService.assistants.subscribe(data => {
      if(data){
        this.listUsers = data;
      }
    });
    this.eventService.tickets.subscribe(data => {
      if(data){
        this.listTickects = data;
      }
    });
    this.eventService.roles.subscribe(data => {
      if(data){
        this.roles = data;
      }
    });
    this.authService.user.subscribe(data => {
      if(data){
        this.user = data;
      }
    })
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.listTicketsThis.length / this.itemsPerPage);
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
    let filteredItems = this.listTicketsThis;
    if (this.typeFilter !== '0') {
      filteredItems = filteredItems.filter((item: TicketUser) => {
        switch (this.typeFilter) {
          case '1':
            return (item.key.toString()).toLowerCase().includes(this.writeFilter.toLowerCase());
          case '2':
            return (item.usuario.toString()).toLowerCase().includes(this.writeFilter.toLowerCase());
          case '3':
            return (item.rol.toString()).toLowerCase().includes(this.writeFilter.toLowerCase());
          case '4':
            return (item.nombre.toString()).toLowerCase().includes(this.writeFilter.toLowerCase());
          default:
            return true;
        }
      });
    }
    if (this.typeFilter === '0' && this.writeFilter.trim() !== '') {
      const filterValue = this.writeFilter.toLowerCase().trim();
      filteredItems = filteredItems.filter((item: TicketUser) =>
        (item.key.toString()).toLowerCase().includes(filterValue) ||
        (item.usuario.toString()).toLowerCase().includes(filterValue) ||
        (item.rol.toString()).toLowerCase().includes(filterValue) ||
        (item.nombre.toString()).toLowerCase().includes(filterValue)
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
          return compare(a.key, b.key, isAsc);
        case 'usuario':
          return compare(a.usuario, b.usuario, isAsc);
        case 'rol':
          return compare(a.rol, b.rol, isAsc);
        case 'nombre':
          return compare(a.nombre, b.nombre, isAsc);
        default:
          return 0;
      }
    });
  }

  onDelete(ticket: TicketUser) {
    this.dialog.open<OutputData>(DeleteComponent, {
      data: {
        title: '¿Está seguro que desea eliminar la relación ' + ticket.key + ' / ' + ticket.nombre + '?',
      }
    }).closed.subscribe(data => {
      if (data?.rta) {

      }
    })
  }

  onCreate(){
    this.dialog.open(SaveAssistantTicketComponent, {
      data: {
        userAssistants: this.listUsers,
        ticekts: this.listTickects,
        typeSave: 'assistant-ticket',
        eventId: this.eventConfig.event.eventId,
        clientId: this.eventConfig.event.clientId,
        adminUserId: this.user?.adminUserId,
        roles: this.roles,
      }
    })
  }

  chargeAssistantTickets(){
    this.dialog.open(FileComponent,
      {
        data: {
          clientId: this.eventConfig.event.clientId,
          eventId: this.eventConfig.event.eventId,
          adminUserId: this.user?.adminUserId,
          rta: 'ticket-assistant',
        }
      }
    )
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}