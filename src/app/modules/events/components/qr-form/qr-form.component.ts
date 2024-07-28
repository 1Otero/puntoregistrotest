import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { IEvent, IQuorumCreate } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AssistantService } from 'src/app/services/assistant.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-qr-form',
  templateUrl: './qr-form.component.html',
  styleUrls: ['./qr-form.component.scss']
})
export class QrFormComponent implements OnInit, OnChanges, AfterViewInit {

  status: RequestStatus = 'init';
  statusCreate: RequestStatus = 'init';
  formData: FormGroup;
  @Input() event: IEvent = {
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
  };
  @Output() message = new EventEmitter<string>();
  eventId: number = 0;
  @Input() button: 'registro' | 'salida' = 'registro';
  showButtonCreateUser: boolean = false;
  userAssistant: IUserAssistant = {
    userId: null,
    clientId: 0,
    loadListId: 0,
    idTypeDoc: 0,
    docId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    phoneNumber: '',
    birthday: 0,
    gender: '',
    rh: '',
    eventId: 0,
    agreedToTermsOfUse: null,
    viewAccessPoint: '',
    register: true,
    registration: 0,
    registerPoint: true,
    errorMessage: '',
    infoVariable: '',
    logdel: true
  };
  user: IUserAdmin | null = null;
  adminUserId: number = 0;
  @ViewChild('qrInput') qrInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private assistantService: AssistantService,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService,
    private eventService: EventService
  ) { }

  ngAfterViewInit(): void {
    this.qrInput.nativeElement.focus();
  }

  ngOnInit() {
    this.formData = this.fb.group({
      codigoQr: ['', [Validators.required, Validators.pattern(/^\d+-\d+$/)]],
    });
    this.authService.user.subscribe(data => {
      if(data){
        this.user = data;
        this.adminUserId = this.user.adminUserId;
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.eventId = this.event.eventId;
  }

  submitForm() {
    if (this.formData.valid) {
      this.status = 'loading';
      if (this.button === 'registro') {
        const { codigoQr } = this.formData.getRawValue();
        this.assistantService.getAttendant(3, this.eventId, Number(codigoQr.split('-')[0]), codigoQr.split('-')[1], '', '', this.adminUserId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              const queryParams = {
                eventCode: this.event.codEvent,
                userId: data.payload.attendant.userId
              };
              this.router.navigate(['punto-registro-operador/evento/registro'], { queryParams: queryParams });
              this.status = 'success';
            } else {
              this.message.emit(data.errorMessage.message);
              if (data.errorMessage.message === "El usuario no se encuentra registrado en la base de datos, si desea registrarlo por favor de click en el botón crear usuario") {
                this.showButtonCreateUser = true;
              }
              this.status = 'failed';
            }
          },
          error: (error) => {
            console.error(error);
            this.status = 'failed';
          }
        })
      } else {
        const { codigoQr } = this.formData.getRawValue();
        this.assistantService.registerExit(Number(codigoQr.split('-')[0]), codigoQr.split('-')[1], this.event.eventId, this.adminUserId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              const quorum: IQuorumCreate = {
                eventId: this.event.eventId,
                type: 2,
              }
              this.eventService.saveChartQuorum(quorum).subscribe(data => {

              });
              this.status = 'success';
              const queryParams = {
                eventCode: this.event.codEvent,
                userId: data.payload.userId
              };
              this.router.navigate(['punto-registro-operador/evento/salida'], { queryParams: queryParams });
              this.authService.notifyfrontconnectforquorum(this.eventId).subscribe(data => {
              })
            } else {
              this.status = 'failed';
              this.message.emit(data.errorMessage.message);
            }
          },
          error: (error) => {
            console.error(error);
            this.status = 'failed';
            this.toastrService.error(environment.messageError);
          }
        })
      }

    } else {
      this.formData.markAllAsTouched();
    }
  }

  resetFields() {
    this.formData.patchValue({
      codigoQr: ''
    })
  }

  createUser() {
    if (this.formData.valid) {
      this.statusCreate = 'loading';
      const { codigoQr } = this.formData.getRawValue();
      this.userAssistant = {
        ... this.userAssistant,
        idTypeDoc: Number(codigoQr.split('-')[0]),
        docId: codigoQr.split('-')[1],
        eventId: this.event.eventId,
        clientId: this.event.clientId
      }
      this.assistantService.create(this.userAssistant, this.adminUserId).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            const queryParams = {
              eventCode: this.event.codEvent,
              userId: data.payload.userId
            };
            this.router.navigate(['punto-registro-operador/evento/registro'], { queryParams: queryParams });
            this.statusCreate = 'success';
          } else {
            this.toastrService.info(data.errorMessage.message);
            this.statusCreate = 'failed';
          }
        },
        error: (error) => {
          console.error(error);
          this.statusCreate = 'failed';
          this.toastrService.error(environment.messageError);
        }
      })
    } else {
      this.formData.markAllAsTouched();
    }
  }

}
