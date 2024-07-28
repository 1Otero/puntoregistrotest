import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { IDocumentHistoryComplete } from 'src/app/models/document-history.model';
import { EventService } from 'src/app/services/event.service';
import { ListErrorInitialChargeComponent } from '../../components/list-error-initial-charge/list-error-initial-charge.component';
import { FileComponent } from '../../components/file/file.component';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { IEventConfig } from 'src/app/models/event.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { RequestStatus } from 'src/app/models/request-status.model';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  status: RequestStatus = 'init';
  listHistory: IDocumentHistoryComplete[] = [];
  user: IUserAdmin | null = null;
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
  href: string = `${environment.API_URL}/api/s3/downloadS3File?bucketName=webasamblea-newstorage&fileName=`;
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  totalPages: number = 0;
  displayedItems: IDocumentHistoryComplete[] = [];
  showMessage: boolean = false;

  constructor(
    private eventService: EventService,
    private dialog: Dialog,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.eventService.documentHistory.subscribe(data => {
      this.status = 'loading';
      if (data) {
        this.listHistory = data.reverse();
        this.updateDisplayedItems();
        this.status = 'success';
      }
    });
    this.eventService.event.subscribe(data => {
      if (data) {
        this.eventConfig = data;
        this.eventService.eventEmptyValid(this.eventConfig.event.eventId).subscribe({
          next: (data) => {
            if(data.status === 'success'){
              if(data.payload){
                this.showMessage = data.payload;
              }
            }
          },
          error: (error) => {
            console.error(error);
          }
        });
        this.authService.user.subscribe(data => {
          if (data) {
            this.user = data;
            this.url = `${environment.API_URL}/api/file/downloadTotalTicketsWithControl/${this.eventConfig.event.eventId}/${this.user.adminUserId}`
          }
        })
      }
    });
  }

  descargarArchivo() {
    this.eventService.downloadExcelFormarInitial(this.eventConfig.event.eventId, this.eventConfig.event.name, '').subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.eventConfig.event.name + '.xlsx'; 
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  onErrors(history: IDocumentHistoryComplete) {
    this.dialog.open(ListErrorInitialChargeComponent, {
      data: {
        errors: history.documentHistoryErrorList
      }
    })
  }

  onInitialCharge() {
    const adminUserId = this.user?.adminUserId;
    this.dialog.open(FileComponent, {
      data: {
        clientId: this.eventConfig.event.clientId,
        eventId: this.eventConfig.event.eventId,
        adminUserId: adminUserId ? adminUserId : 0,
        rta: 'initial',
      }
    });
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.listHistory.length / this.itemsPerPage);
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
    this.displayedItems = this.listHistory;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.displayedItems.length);
    this.displayedItems = this.displayedItems.slice(startIndex, endIndex);
    this.updateTotalPages();
  }

}
