import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DocumentHistoryService } from '../../../../services/document-history.service';
import { Dialog } from '@angular/cdk/dialog';
import { InfoDataComponent } from '../../../../modules/shared/components/info-data/info-data.component';
import { ListErrorInitialChargeComponent } from '../list-error-initial-charge/list-error-initial-charge.component';
import { RequestStatus } from '../../../../models/request-status.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConfirmChargeComponent } from 'src/app/modules/shared/components/confirm-charge/confirm-charge.component';
import { HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TicketService } from 'src/app/services/ticket.service';
import { AssistantService } from 'src/app/services/assistant.service';
import { TicketUserService } from 'src/app/services/ticket-user.service';

interface InputData {
  clientId: number;
  eventId: number;
  adminUserId: number;
  rta: 'initial' | 'ticket' | 'assistant' | 'ticket-assistant' | '';
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      state('out', style({ transform: 'translateY(-100%)', opacity: 0 })),
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('0.4s ease-out')
      ]),
      transition('* => out', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('0.4s ease-in')
      ])
    ])
  ]
})
export class FileComponent {

  status: RequestStatus = 'init';
  selectedFile: File | undefined;
  nameArchivo: string = 'Ningún archivo seleccionado';
  eventId: number = 0;
  clientId: number = 0;
  adminUserId: number = 0;
  tipoArchivo: 'initial' | 'ticket' | 'assistant' | 'ticket-assistant' | '' = '';
  dialogAnimationState: 'in' | 'out' = 'in';
  progress: number = 0;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private toastrService: ToastrService,
    private documentHistoryService: DocumentHistoryService,
    private dialog: Dialog,
    private ticketService: TicketService,
    private assistantService: AssistantService,
    private ticketUserService: TicketUserService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data.rta) {
      this.eventId = data.eventId;
      this.clientId = data.clientId;
      this.adminUserId = data.adminUserId;
      this.tipoArchivo = data.rta;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.nameArchivo = event.target.files[0].name;
  }

  uploadFile() {
    if (this.selectedFile) {
      this.status = 'loading';
      switch (this.tipoArchivo) {
        case 'initial':
          this.documentHistoryService.validateEventEmptyValid(this.eventId).subscribe(
            {
              next: (data) => {
                if (data.payload) {
                  this.documentHistoryService.initialCharge(this.adminUserId, this.clientId, this.eventId, this.selectedFile).subscribe(
                    {
                      next: (data) => {
                        if (data.payload.errors) {
                          this.status = 'failed';
                          this.toastrService.error('El archivo contiene ' + data.payload.errors?.length + ' error(es)');
                          this.dialog.open(ListErrorInitialChargeComponent,
                            {
                              data: {
                                errors: data.payload.errors
                              }
                            });
                          this.clearFile();
                        } else {
                          this.status = 'success';
                          this.toastrService.success('Información registrada');
                          this.close();
                        }
                      },
                      error: (error) => {
                        console.error(error);
                        this.status = 'failed';
                        this.toastrService.error(environment.messageError);
                        this.clearFile();
                      }
                    }
                  );
                } else {
                  this.dialog.open(InfoDataComponent).closed.subscribe(data => {
                    if (data) {
                      this.dialog.open(ConfirmChargeComponent).closed.subscribe(data => {
                        if (data) {
                          this.documentHistoryService.deleteInitialCharge(this.eventId).subscribe(
                            {
                              next: (data) => {
                                if (data) {
                                  this.documentHistoryService.initialCharge(this.adminUserId, this.clientId, this.eventId, this.selectedFile).subscribe(
                                    {
                                      next: (data) => {
                                        if (data.payload.errors) {
                                          if (data.payload.errors.length === 0) {
                                            this.status = 'success';
                                            this.toastrService.success('Información registrada');
                                            this.close();
                                          } else {
                                            this.status = 'failed';
                                            this.toastrService.error('El archivo contiene ' + data.payload.errors.length + ' error(es)');
                                            this.dialog.open(ListErrorInitialChargeComponent,
                                              {
                                                data: {
                                                  errors: data.payload.errors
                                                }
                                              });
                                          }
                                          this.clearFile();
                                        } else {
                                          this.status = 'success';
                                          this.toastrService.success('Información registrada');
                                          this.close();
                                        }
                                      },
                                      error: (error) => {
                                        console.error(error);
                                        this.status = 'failed';
                                        this.toastrService.error(environment.messageError);
                                        this.clearFile();
                                      }
                                    }
                                  );
                                } else {
                                  this.status = 'success';
                                  this.toastrService.success('Información registrada');
                                  this.close();
                                }
                              },
                              error: (error) => {
                                console.error(error);
                                this.status = 'failed';
                                this.toastrService.error(environment.messageError);
                                this.clearFile();
                              }
                            }
                          );
                        } else {
                          this.status = 'failed';
                          this.clearFile();
                        }
                      });
                    } else {
                      this.status = 'failed';
                      this.clearFile();
                    }
                  })
                }
              },
              error: (error) => {
                console.error(error);
                this.status = 'failed';
                this.toastrService.error(environment.messageError);
                this.clearFile();
              }
            }
          );
          break;
        case 'ticket':
          this.ticketService.upload(this.eventId, this.clientId, this.adminUserId, this.selectedFile).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                if (data.payload.errors) {
                  this.status = 'failed';
                  this.toastrService.error('El archivo contiene ' + data.payload.errors?.length + ' error(es)');
                  this.dialog.open(ListErrorInitialChargeComponent,
                    {
                      data: {
                        errors: data.payload.errors
                      }
                    });
                    this.clearFile();
                } else {
                  this.status = 'success';
                  this.toastrService.success('Se crearon ' + (data.payload.TicketsCreated !== undefined ? data.payload.TicketsCreated : 0) + ' y se actualizaron ' + (data.payload.TicketsUpdated !== undefined ? data.payload.TicketsUpdated : 0) + ' tickets');
                  this.close();
                }
              } else {
                this.status = 'failed';
                this.toastrService.info(data.errorMessage.message);
                this.clearFile();
              }
            }, error: (error) => {
              console.error(error);
              this.toastrService.error(environment.messageError);
              this.status = 'failed';
              this.clearFile();
            }
          })
          break;
        case 'assistant':
          this.assistantService.upload(this.eventId, this.clientId, this.adminUserId, this.selectedFile).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                if (data.payload.errors) {
                  this.status = 'failed';
                  this.toastrService.error('El archivo contiene ' + data.payload.errors?.length + ' error(es)');
                  this.dialog.open(ListErrorInitialChargeComponent,
                    {
                      data: {
                        errors: data.payload.errors
                      }
                    });
                    this.clearFile();
                } else {
                  this.status = 'success';
                  this.toastrService.success('Se crearon ' + (data.payload.UsersCreated !== undefined ? data.payload.UsersCreated : 0) + ' y se actualizaron ' + (data.payload.UsersUpdated !== undefined ? data.payload.UsersUpdated : 0) + ' usuarios');
                  this.close();
                }
              } else {
                this.status = 'failed';
                this.toastrService.info(data.errorMessage.message);
                this.clearFile();
              }
            }, error: (error) => {
              console.error(error);
              this.toastrService.error(environment.messageError);
              this.status = 'failed';
              this.clearFile();
            }
          })
          break;
        case 'ticket-assistant':
          this.ticketUserService.upload(this.eventId, this.clientId, this.adminUserId, this.selectedFile).subscribe({
            next: (data) => {
              if (data.status === 'success') {
                if (data.payload.errors) {
                  this.status = 'failed';
                  this.toastrService.error('El archivo contiene ' + data.payload.errors?.length + ' error(es)');
                  this.dialog.open(ListErrorInitialChargeComponent,
                    {
                      data: {
                        errors: data.payload.errors
                      }
                    });
                    this.clearFile();
                } else {
                  this.status = 'success';
                  this.toastrService.success('Se crearon ' + (data.payload.TicketUsersCreated !== undefined ? data.payload.TicketUsersCreated : 0) + ' y se actualizaron ' + (data.payload.TicketUsersUpdated !== undefined ? data.payload.TicketUsersUpdated : 0) + ' asistentes vs votos');
                  this.close();
                }
              } else {
                this.status = 'failed';
                this.toastrService.info(data.errorMessage.message);
                this.clearFile();
              }
            }, error: (error) => {
              console.error(error);
              this.toastrService.error(environment.messageError);
              this.status = 'failed';
              this.clearFile();
            }
          })
          break;
        default:
          break;
      }
    } else {
      this.toastrService.info('Seleccione el archivo');
    }
  }

  clearFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
    this.selectedFile = undefined;
    this.nameArchivo = '';
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }

}
