import { animate, style, transition, trigger } from '@angular/animations';
import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { IClient } from 'src/app/models/client.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { ClientService } from 'src/app/services/client.service';
import { SaveClientComponent } from '../../components/save-client/save-client.component';
import { Subscription } from 'rxjs';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  animations: [
    trigger('clientsAnimation', [
      transition('void => enter', [
        style({ opacity: 1, transform: 'translateX(0%)' }),
        animate('500ms ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ]),
      transition('enter => leave', [
        style({ opacity: 1, transform: 'translateX(0%)' }),
        animate('500ms ease-in-out', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ]),
      transition('leave => enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('500ms ease-in-out', style({ opacity: 1, transform: 'translateX(0%)' }))
      ])
    ]),
  ],
})
export class ClientComponent implements OnInit {

  status: RequestStatus = 'init';
  listClients: IClient[] = [];
  listClientsFilter: IClient[] = [];
  clientNameFilter: string = '';
  listOrGrid: 'list' | 'grid' = 'grid';
  totalClients: number = 0;
  totalActivos: number = 0;
  totalPasados: number = 0;
  selectedStatus: number = 1;
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  totalPages: number = 0;
  displayedItems: IClient[] = [];
  clientsAnimationState = 'void';
  subscription: Subscription;
  user: IUserAdmin | null = null;

  constructor(
    private clientService: ClientService,
    private titleService: Title,
    private authService: AuthService,
    private dialog: Dialog,
  ) { 
    this.titleService.setTitle('Punto de registro');
  }

  ngOnInit(): void {
    const savedViewMode = localStorage.getItem('viewModeClient');
    if (savedViewMode) {
      this.listOrGrid = savedViewMode as 'list' | 'grid';
    }

    this.status = 'loading';
    this.clientService.get().subscribe({
      next: (data) => {
        if (data.status === 'success') {
          this.listClients = data.payload;
          this.listClientsFilter = this.listClients.reverse();
          this.totalClients = this.listClients.length;
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
    this.subscription = this.clientService.refresh.subscribe(() => {
      this.status = 'loading';
      this.clientService.get().subscribe({
        next: (data) => {
          if (data.status === 'success') {
            this.listClients = data.payload;
            this.listClientsFilter = this.listClients.reverse();
            this.totalClients = this.listClients.length;
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

    this.authService.user.subscribe(data => {
      if(data){
        this.user = data;
      }
    });
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.listClientsFilter.length / this.itemsPerPage);
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
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.listClientsFilter.length);
    this.displayedItems = this.listClientsFilter.slice(startIndex, endIndex);
    this.updateTotalPages();
  }


  switchView(mode: 'list' | 'grid'): void {
    this.listOrGrid = mode;
    localStorage.setItem('viewModeClient', mode);
  }

  applyFilter() {
    this.listClientsFilter = this.listClients.filter(event => event.name ? event.name.toLowerCase().includes(this.clientNameFilter.toLowerCase()) : '').reverse();
    this.updateDisplayedItems();
  }

  filterByStatus(status: number) {
    if (status === 1) {
      // this.listEventsFilter = this.listEvents;
      this.selectedStatus = 1;
    } else if (status === 2) {
      // this.listEventsFilter = this.listEvents.filter(item => item.status === 1);
      this.selectedStatus = 2;
    } else if (status === 3) {
      // this.listEventsFilter = this.listEvents.filter(item => item.status === 0);
      this.selectedStatus = 3;
    }
  }

  createClient() {
    this.dialog.open(SaveClientComponent,{
      data: {
        cliente: null,
        isSave: false,
        adminUserId: this.user?.adminUserId
      }
    })
  }


}
