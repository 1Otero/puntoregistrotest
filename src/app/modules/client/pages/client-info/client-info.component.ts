import { Dialog } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IEvent, IEventConfig } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { ClientService } from 'src/app/services/client.service';
import { EventService } from 'src/app/services/event.service';
import { SaveDataEventComponent } from '../../components/save-data-event/save-data-event.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent {

  status: RequestStatus = 'init';
  listEvents: IEventConfig[] = [];
  listEventsFilter: IEventConfig[] = [];
  user: IUserAdmin | null = null;
  suscription: Subscription;
  eventNameFilter: string = '';
  totalEvents: number = 0;
  totalActives: number = 0;
  totalPast: number = 0;
  listOrGrid: 'list' | 'grid' = 'grid';
  selectedStatus: number = 1;
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  totalPages: number = 0;
  displayedItems: IEventConfig[] = [];
  clientsAnimationState = 'void';
  statusChange: RequestStatus = 'init';
  clientId: number = 0;

  constructor(
    private eventService: EventService,
    private dialog: Dialog,
    private router: Router,
    private route: ActivatedRoute,
    private clienteService: ClientService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
      this.listOrGrid = savedViewMode as 'list' | 'grid';
    }
    this.route.params.subscribe(data => {
      const url = data['id'];
      this.status = 'loading';
      this.clienteService.getByUrl(url).subscribe({
        next: (data) => {
          if (data) {
            this.clientId = data.payload.clientId;
            this.titleService.setTitle(data.payload.url);
            this.eventService.getByClientId(data.payload.clientId).subscribe({
              next: (data) => {
                if (data.status === 'success') {
                  this.listEvents = data.payload;
                  this.listEventsFilter = this.listEvents.reverse();
                  this.totalEvents = this.listEvents.length;
                  this.totalActives = this.listEvents.filter(item => item.event.status === 1).length;
                  this.totalPast = this.listEvents.filter(item => item.event.status === 0).length;
                  this.listEventsFilter = this.listEvents;
                  this.filterByStatus(2);
                  this.updateDisplayedItems();
                  this.status = 'success';
                } else {
                  this.status = 'failed';
                }
              },
              error: (error) => {
                console.error(error);
                this.status = 'failed';
              }
            });
            this.suscription = this.eventService.refresh.subscribe(() => {
              this.status = 'loading';
              this.eventService.getByClientId(data.payload.clientId).subscribe({
                next: (data) => {
                  if (data.status === 'success') {
                    this.listEvents = data.payload;
                    this.listEventsFilter = this.listEvents.reverse();
                    this.totalEvents = this.listEvents.length;
                    this.totalActives = this.listEvents.filter(item => item.event.status === 1).length;
                    this.totalPast = this.listEvents.filter(item => item.event.status === 0).length;
                    this.listEventsFilter = this.listEvents;
                    this.filterByStatus(2);
                    this.updateDisplayedItems();
                    this.status = 'success';
                  } else {
                    this.status = 'failed';
                  }
                },
                error: (error) => {
                  console.error(error);
                  this.status = 'failed';
                }
              });
            })
          }
        },
        error: (error) => {
          console.error(error);
        }
      })

    })
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.listEventsFilter.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.clientsAnimationState = 'enter';
      this.currentPage--;
      this.updateDisplayedItems();
      this.clientsAnimationState = 'leave';
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.clientsAnimationState = 'leave';
      this.currentPage++;
      this.updateDisplayedItems();
      this.clientsAnimationState = 'enter';
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
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.listEventsFilter.length);
    this.displayedItems = this.listEventsFilter.slice(startIndex, endIndex);
    this.updateTotalPages();
  }


  createEvent() {
    this.dialog.open(SaveDataEventComponent,
      {
        data: {
          event: null,
          isSave: false,
          clientId: this.clientId,
          adminUserId: this.user?.adminUserId
        }
      }
    )
  }

  applyFilter() {
    this.listEventsFilter = this.listEvents.filter(event => event.event.name.toLowerCase().includes(this.eventNameFilter.toLowerCase()));
    this.updateDisplayedItems();
  }

  switchView(mode: 'list' | 'grid'): void {
    this.listOrGrid = mode;
    localStorage.setItem('viewMode', mode);
  }

  filterByStatus(status: number) {
    if (status === 1) {
      this.statusChange = 'loading';
      setTimeout(() => {
        this.listEventsFilter = this.listEvents;
        this.selectedStatus = 1;
        this.updateDisplayedItems();
        this.statusChange = 'success';
      }, 500);
    } else if (status === 2) {
      this.statusChange = 'loading';
      setTimeout(() => {
        this.listEventsFilter = this.listEvents.filter(item => item.event.status === 1);
        this.selectedStatus = 2;
        this.updateDisplayedItems();
        this.statusChange = 'success';
      }, 500);
    } else if (status === 3) {
      this.statusChange = 'loading';
      setTimeout(() => {
        this.listEventsFilter = this.listEvents.filter(item => item.event.status === 0);
        this.selectedStatus = 3;
        this.updateDisplayedItems();
        this.statusChange = 'success';
      }, 500);
    }
  }

  onBack() {
    this.router.navigate(['punto-registro-operador/cliente']);
  }

}
