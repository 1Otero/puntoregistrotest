import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { IEventConfig } from 'src/app/models/event.model';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from '@angular/cdk/dialog';
import { OutputData } from 'src/app/models/data.model';
import { DeleteComponent } from 'src/app/modules/shared/components/delete/delete.component';
import { EventService } from 'src/app/services/event.service';
import { SaveDataEventComponent } from '../save-data-event/save-data-event.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list-event',
  templateUrl: './list-event.component.html',
  styleUrls: ['./list-event.component.scss']
})
export class ListEventComponent implements OnInit, OnChanges {

  @Input() events: IEventConfig[] = [];
  eventsFilter: IEventConfig[] = [];
  @Input() eventNameFilter: string = '';
  eventNameFilterThis: string = '';
  @Input() selectedStatus: number = 1;
  selectedStatusThis: number = 1;
  displayedItems: IEventConfig[] = [];
  sortedData: IEventConfig[];
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  totalPages: number = 0;

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private dialog: Dialog,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.eventsFilter = this.events;
    this.updateDisplayedTickets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events']) {
      this.eventsFilter = this.events;
      this.updateDisplayedTickets();
    }
    if (changes['eventNameFilter']) {
      this.eventNameFilterThis = this.eventNameFilter;
      this.applyFilter();
    }
    if (changes['selectedStatus']) {
      this.selectedStatusThis = this.selectedStatus;
      this.filterByStatus(this.selectedStatusThis);
    }
  }

  updateDisplayedTickets() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.eventsFilter.length);
    this.displayedItems = this.eventsFilter.slice(startIndex, endIndex);
    this.updateTotalPages();
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.eventsFilter.length / this.itemsPerPage);
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

  applyFilter() {
    this.eventsFilter = this.events.filter(event => event.event.name ? event.event.name.toLowerCase().includes(this.eventNameFilterThis.toLowerCase()) : '').reverse();
    this.updateDisplayedTickets();
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

  sortData(sort: Sort) {
    const data = this.events;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nombre':
          return compare((a.event.name), (b.event.name), isAsc);
        default:
          return 0;
      }
    });
  }

  onEvent(event: IEventConfig) {
    if (event.event.codEvent !== 0) {
      const queryParams = {
        eventCode: event.event.codEvent,
      }
      if (event.event.status === 1) {
        if (event.configRegistrationPoint) {
          this.eventService.eventEmptyValid(event.event.eventId).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                if (!data.payload) {
                  const urlTree = this.router.createUrlTree(['punto-registro-operador/evento'], { queryParams: queryParams });
                  const url = this.router.serializeUrl(urlTree);
                  window.open(url, '_blank');
                } else {
                  const urlTree = this.router.createUrlTree(['punto-registro-operador/base-de-datos/historial'], { queryParams: queryParams });
                  const url = this.router.serializeUrl(urlTree);
                  window.open(url, '_blank');
                }
              } else {
                this.toastrService.info(data.errorMessage.message);
              }
            },
            error: (error) => {
              console.error(error);
              this.toastrService.error(environment.messageError);
            }
          })
        } else {
          const urlTree = this.router.createUrlTree(['punto-registro-operador/no-configurado'], { queryParams: queryParams });
          const url = this.router.serializeUrl(urlTree);
          window.open(url);
        }
      } else {
        const urlTree = this.router.createUrlTree(['punto-registro-operador/cerrado'], { queryParams: queryParams });
        const url = this.router.serializeUrl(urlTree);
        window.open(url);
      }
    } else {
      this.toastrService.info('El evento no cuenta con código');
    }
  }

  onClose(event: IEventConfig) {
    this.dialog.open<OutputData>(DeleteComponent,
      {
        data: {
          title: '¿Está seguro que desea cerrar el evento?'
        }
      }
    ).closed.subscribe(data => {
      if (data?.rta) {
        this.eventService.delete(event.event.eventId).subscribe({
          next: (data) => {

          }
        })
      }
    })
  }

  onEdit(event: IEventConfig) {
    this.dialog.open(SaveDataEventComponent,
      {
        data: {
          event: event.event,
          isSave: true,
          clientId: event.event.clientId
        }
      }
    )
  }

  onActive(event: IEventConfig) {
    this.eventService.delete(event.event.eventId).subscribe({
      next: (data) => {

      }
    })
  }

  onPreregister(event: IEventConfig) {
    const queryParams = {
      eventId: event.event.eventId,
    }
    const urlTree = this.router.createUrlTree(['punto-registro-operador/configuracion-evento'], { queryParams: queryParams });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  onPreregisterUser(event: IEventConfig) {
    const queryParams = {
      eventCode: event.event.codEvent,
    }
    const urlTree = this.router.createUrlTree(['preregistro/registro'], { queryParams: queryParams });
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  filterByStatus(status: number) {
    if (status === 1) {
      this.eventsFilter = this.events;
      this.selectedStatus = 1;
      this.updateDisplayedTickets();
    } else if (status === 2) {
      this.eventsFilter = this.events.filter(item => item.event.status === 1);
      this.selectedStatus = 2;
      this.updateDisplayedTickets();
    } else if (status === 3) {
      this.eventsFilter = this.events.filter(item => item.event.status === 0);
      this.selectedStatus = 3;
      this.updateDisplayedTickets();
    }
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}