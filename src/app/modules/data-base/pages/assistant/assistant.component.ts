import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { IAssistantDataWithTickets, ITicketUser, IUserAssistant } from 'src/app/models/assistant.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { EventService } from 'src/app/services/event.service';
import { SaveAssistantComponent } from '../../components/save-assistant/save-assistant.component';
import { IEventConfig } from 'src/app/models/event.model';
import { OutputData } from 'src/app/models/data.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { TicketsComponent } from '../../components/tickets/tickets.component';
import { environment } from 'src/environments/environment';
import { FileComponent } from '../../components/file/file.component';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.scss']
})
export class AssistantComponent implements OnInit {

  status: RequestStatus = 'init';
  listAssistant: IAssistantDataWithTickets[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  totalPages: number = 0;
  displayedItems: IAssistantDataWithTickets[] = [];
  typeFilter: string = '0';
  writeFilter: string = '';
  sortedData: IAssistantDataWithTickets[];
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
  user:IUserAdmin | null = null;
  isOpen: boolean = false;

  constructor(
    private eventService: EventService,
    private dialog: Dialog,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.authService.user.subscribe(data => {
      if(data){
        this.user = data;
      }
    })
    this.eventService.assistants.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.listAssistant = data;
        this.status = 'success';
        this.updateDisplayedItems();
      }
    });
    this.eventService.event.subscribe(data => {
      if (data) {
        this.eventConfig = data;
        this.url = `${environment.API_URL}/api/file/downloadTotalUsers/${this.eventConfig.event.eventId}`;
      }
    })
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.listAssistant.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedItems();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedItems();
    }
  }

  changePageSize() {
    const firstItemIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentPage = Math.floor(firstItemIndex / this.itemsPerPage) + 1;
    this.updateTotalPages();
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    this.updateDisplayedItems();
  }

  updateDisplayedItems() {
    let filteredItems = this.listAssistant;
    if (this.typeFilter !== '0') {
      filteredItems = filteredItems.filter((item: IAssistantDataWithTickets) => {
        switch (this.typeFilter) {
          case '1':
            return item.userAssistant.docId.toLowerCase().includes(this.writeFilter.toLowerCase());
          case '2':
            return (item.userAssistant.firstName + ' ' + item.userAssistant.lastName).toLowerCase().includes(this.writeFilter.toLowerCase());
          case '3':
            return item.userAssistant.phoneNumber.toLowerCase().includes(this.writeFilter.toLowerCase());
          case '4':
            return item.userAssistant.email.toLowerCase().includes(this.writeFilter.toLowerCase());
          default:
            return true;
        }
      });
    }
    if (this.typeFilter === '0' && this.writeFilter.trim() !== '') {
      const filterValue = this.writeFilter.toLowerCase().trim();
      filteredItems = filteredItems.filter((item: IAssistantDataWithTickets) =>
        item.userAssistant.docId.toLowerCase().includes(filterValue) ||
        (item.userAssistant.firstName + ' ' + item.userAssistant.lastName).toLowerCase().includes(filterValue) ||
        (item.userAssistant.phoneNumber ? item.userAssistant.phoneNumber : '').toLowerCase().includes(filterValue) ||
        (item.userAssistant.email ? item.userAssistant.email : '').toLowerCase().includes(filterValue)
      );
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, filteredItems.length);
    this.displayedItems = filteredItems.slice(startIndex, endIndex);
    this.updateTotalPages();
  }

  sortData(sort: Sort) {
    const data = this.displayedItems;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'doc':
          return compare(a.userAssistant.docId, b.userAssistant.docId, isAsc);
        case 'nombre':
          return compare(a.userAssistant.firstName + ' ' + a.userAssistant.lastName, b.userAssistant.firstName + ' ' + b.userAssistant.lastName, isAsc);
        case 'telefono':
          return compare(a.userAssistant.phoneNumber, b.userAssistant.phoneNumber, isAsc);
        case 'correo':
          return compare(a.userAssistant.email, b.userAssistant.email, isAsc);
        default:
          return 0;
      }
    });
  }

  onCreate() {
    this.dialog.open(SaveAssistantComponent, {
      data: {
        userAssistant: null,
        isSave: false,
        eventId: this.eventConfig.event.eventId,
        clientId: this.eventConfig.event.clientId,
        isFree: false,
        numberIsFree: 1,
        adminUserId: this.user?.adminUserId
      }
    })
  }

  onEdit(user: IUserAssistant) {
    delete user.isOpen;
    delete user.isSelect;
    this.dialog.open(SaveAssistantComponent, {
      data: {
        userAssistant: user,
        isSave: true,
        eventId: this.eventConfig.event.eventId,
        clientId: this.eventConfig.event.clientId,
        isFree: false,
        numberIsFree: 1,
        adminUserId: this.user?.adminUserId
      }
    })
  }

  onDelete(user: IUserAssistant) {
    delete user.isOpen;
    delete user.isSelect;
    this.dialog.open<OutputData>(DeleteComponent,{
      data: {
        title: '¿Está seguro que desea eliminar al usuario ' + user.firstName + ' ' + user.lastName + '?',
      }
    }).closed.subscribe(data => {
      if(data?.rta){

      }
    })
  }

  onTickets(tickets: ITicketUser[]){
    this.dialog.open(TicketsComponent, {
      data: {
        tickets: tickets,
      }
    })
  }

  chargeAssistant() {
    this.dialog.open(FileComponent,
      {
        data: {
          clientId: this.eventConfig.event.clientId,
          eventId: this.eventConfig.event.eventId,
          adminUserId: this.user?.adminUserId,
          rta: 'assistant',
        }
      }
    )
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
