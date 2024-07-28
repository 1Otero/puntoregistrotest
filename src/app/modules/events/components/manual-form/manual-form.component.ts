import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { IEvent, IQuorumCreate } from 'src/app/models/event.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { IUserAdmin } from 'src/app/models/user-admin.model';
import { AccessPointService } from 'src/app/services/access-point.service';
import { AssistantService } from 'src/app/services/assistant.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manual-form',
  templateUrl: './manual-form.component.html',
  styleUrls: ['./manual-form.component.scss']
})
export class ManualFormComponent implements OnChanges, AfterViewInit {

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
  @Output() messageError = new EventEmitter<string>();
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
  @ViewChild('numeroDocumentoInput') numeroDocumentoInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private assistantService: AssistantService,
    private router: Router,
    private toastrService: ToastrService,
    private authService: AuthService,
    private eventService: EventService,
    private accessPointService: AccessPointService,
  ) { }

  ngAfterViewInit(): void {
    this.numeroDocumentoInput.nativeElement.focus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.eventId = this.event.eventId;
  }

  ngOnInit() {
    this.authService.user.subscribe(data => {
      if(data){
        this.user = data;
        this.adminUserId = this.user.adminUserId;
      }
    })
    this.formData = this.fb.group({
      tipoDocumento: ['1', [Validators.required]],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(5)]],
      apellido: [''],
      nombre: [''],
    });
    this.validator();
  }

  validator(){
    this.formData.get('tipoDocumento')?.valueChanges.subscribe((newIdTypeDoc) => {
      if (newIdTypeDoc === '1') {
        this.formData.get('numeroDocumento')?.setValidators([
          Validators.required, Validators.pattern(/^\d+$/)
        ]);
      } else if(newIdTypeDoc === '2') {
        this.formData.get('numeroDocumento')?.setValidators([
          Validators.required
        ]);
      } else {
        this.formData.get('numeroDocumento')?.setValidators([
          Validators.required
        ]);
      }
      this.formData.get('numeroDocumento')?.updateValueAndValidity();
    });
  }

  submitForm() {
    if (this.formData.valid) {
      this.status = 'loading';
      if (this.button === 'registro') {
        const { tipoDocumento, numeroDocumento, apellido, nombre } = this.formData.getRawValue();
        const numeroDocumentoValidado = tipoDocumento === '1' ? (Number(numeroDocumento) * 1).toString() : numeroDocumento; 
        this.assistantService.getAttendant(2, this.eventId, Number(tipoDocumento), numeroDocumentoValidado, nombre, apellido, this.adminUserId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              if (data.payload.tipoAccion === '1') {
                this.message.emit('Usuario no encontrado');
                this.status = 'success';
              } else if (data.payload.tipoAccion === '2') {
                this.messageError.emit('Completar información del usuario: nombre y apellido');
                this.formData = this.fb.group({
                  tipoDocumento: ['1', Validators.required],
                  numeroDocumento: [data.payload.attendant.docId, [Validators.required, Validators.pattern(/^\d+$/)]],
                  apellido: [data.payload.attendant.lastName, Validators.required],
                  nombre: [data.payload.attendant.firstName, Validators.required],
                });
                this.status = 'success';
                this.formData.markAllAsTouched();
              } else {
                const queryParams = {
                  eventCode: this.event.codEvent,
                  userId: data.payload.attendant.userId
                };
                this.router.navigate(['punto-registro-operador/evento/registro'], { queryParams: queryParams });
                this.status = 'success';
                this.accessPointService.refresh.next();
              }
            } else {
              if(data.errorMessage.message === 'Completar información del Usuario: Nombre y Apellido'){
                this.messageError.emit(data.errorMessage.message);
              } else {
                this.message.emit(data.errorMessage.message);
              }
              if (data.errorMessage.message === "El usuario no se encuentra registrado en la base de datos, si desea registrarlo por favor de click en el botón crear usuario") {
                this.showButtonCreateUser = true;
                this.formData = this.fb.group({
                  tipoDocumento: ['1', Validators.required],
                  numeroDocumento: [numeroDocumento, [Validators.required, Validators.pattern(/^\d+$/)]],
                  apellido: [apellido, Validators.required],
                  nombre: [nombre, Validators.required],
                });
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
        const { tipoDocumento, numeroDocumento, apellido, nombre } = this.formData.getRawValue();
        const numeroDocumentoValidado = tipoDocumento === '1' ? (Number(numeroDocumento) * 1).toString() : numeroDocumento; 
        this.assistantService.registerExit(Number(tipoDocumento), numeroDocumentoValidado, this.event.eventId, this.adminUserId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.status = 'success';
              const quorum: IQuorumCreate = {
                eventId: this.event.eventId,
                type: 2,
              }
              this.eventService.saveChartQuorum(quorum).subscribe(data => {

              });
              const queryParams = {
                eventCode: this.event.codEvent,
                userId: data.payload.userId
              };
              this.toastrService.success('Salida registrada');
              this.resetFields();
              this.accessPointService.refresh.next();
              // this.router.navigate(['punto-registro-operador/evento/salida'], { queryParams: queryParams });
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
      tipoDocumento: '1',
      numeroDocumento: '',
      apellido: '',
      nombre: '',
    })
  }

  createUser() {
    if (this.formData.valid) {
      this.statusCreate = 'loading';
      const { tipoDocumento, numeroDocumento, apellido, nombre } = this.formData.getRawValue();
      this.userAssistant = {
        ... this.userAssistant,
        idTypeDoc: tipoDocumento,
        docId: numeroDocumento.toString(),
        lastName: apellido,
        firstName: nombre,
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
