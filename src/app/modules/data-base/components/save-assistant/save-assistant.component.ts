import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { IUserAssistant } from '../../../../models/assistant.model';
import { ITypeDoc } from '../../../../models/type-doc.model';
import { AssistantService } from '../../../../services/assistant.service';
import { TypeDocService } from '../../../../services/type-doc.service';
import { ClientService } from '../../../../services/client.service';
import { EventService } from '../../../../services/event.service';
import { IClient } from '../../../../models/client.model';
import { IEvent } from '../../../../models/event.model';
import { RequestStatus } from '../../../../models/request-status.model';
import { CustomValidators } from 'src/app/utils/validators';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface InputData {
  userAssistant: IUserAssistant;
  isSave: boolean;
  eventId: number;
  clientId: number;
  isFree: boolean;
  numberIsFree: number;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-save-assistant',
  templateUrl: './save-assistant.component.html',
  styleUrls: ['./save-assistant.component.scss'],
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
export class SaveAssistantComponent implements OnInit {

  status: RequestStatus = 'init';
  message: 'Nuevo usuario asistente' | 'Editar usuario asistente' | '' = '';
  messageButton: 'Crear' | 'Editar' | '' = '';
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

  listTypeDoc: ITypeDoc[] = [];
  listClient: IClient[] = [];
  listEvent: IEvent[] = [];
  eventId: number = 0;
  clientId: number = 0;
  form: FormGroup;
  isFree: boolean = false;
  numberIsFree: number = 0;
  dialogAnimationState: 'in' | 'out' = 'in';
  adminUserId: number = 0;

  constructor(
    private typeDocService: TypeDocService,
    private clientService: ClientService,
    private eventService: EventService,
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private assistantService: AssistantService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    this.adminUserId = data.adminUserId;
    this.isFree = data.isFree;
    this.numberIsFree = data.numberIsFree;
    this.eventId = data.eventId;
    this.clientId = data.clientId;
    if (data.isSave) {
      this.userAssistant = data.userAssistant;
      this.form = this.formBuilder.nonNullable.group({
        idTypeDoc: ['1'],
        docId: ['', [Validators.required, Validators.minLength(4)], [CustomValidators.docIdEditAsyncValidator(this.assistantService, this.userAssistant.docId, this.eventId, this.userAssistant.idTypeDoc, this.userAssistant.idTypeDoc)]],
        firstName: ['', [Validators.required]],
        middleName: [''],
        lastName: ['', [Validators.required]],
        secondLastName: [''],
        email: ['', [Validators.email], [CustomValidators.emailEditAsyncValidator(this.assistantService, this.userAssistant.email, this.eventId)]],
        phoneNumber: ['', [], [CustomValidators.phoneEditAsyncValidator(this.assistantService, this.userAssistant.phoneNumber, this.eventId)]],
        birthday: [''],
        gender: [''],
        descriptChange: ['']
      });
      this.actualizarValidadorRequerido(true);
      this.form.get('idTypeDoc')?.valueChanges.subscribe((newIdTypeDoc) => {
        this.form.get('docId')?.setAsyncValidators([
          CustomValidators.docIdEditAsyncValidator(this.assistantService, this.userAssistant.docId, this.eventId, this.userAssistant.idTypeDoc, Number(newIdTypeDoc))
        ]);
        this.form.get('docId')?.updateValueAndValidity();
      });
      this.message = 'Editar usuario asistente';
      this.messageButton = 'Editar';
      this.eventService.getByClientId(this.userAssistant.clientId).subscribe(data => {
        data.payload.map(item => {
          this.listEvent.push(item.event);
        })
      });
      this.form.patchValue({
        idTypeDoc: this.userAssistant.idTypeDoc.toString(),
        docId: this.userAssistant.docId.toString(),
        firstName: this.userAssistant.firstName,
        middleName: this.userAssistant.middleName,
        lastName: this.userAssistant.lastName,
        secondLastName: this.userAssistant.secondLastName,
        email: this.userAssistant.email,
        phoneNumber: this.userAssistant.phoneNumber,
        birthday: '',
        gender: this.userAssistant.gender,
      });
    } else {
      this.form = this.formBuilder.nonNullable.group({
        idTypeDoc: ['1'],
        docId: ['', [Validators.required, Validators.minLength(4)], [CustomValidators.docIdAsyncValidator(this.assistantService, 1, this.eventId)]],
        firstName: ['', [Validators.required]],
        middleName: [''],
        lastName: ['', [Validators.required]],
        secondLastName: [''],
        email: ['', [Validators.email], [CustomValidators.emailAsyncValidator(this.assistantService, this.eventId)]],
        phoneNumber: ['', [], [CustomValidators.phoneAsyncValidator(this.assistantService, this.eventId)]],
        birthday: [''],
        gender: [''],
        descriptChange: ['']
      });
      this.actualizarValidadorRequerido(false);
      this.message = 'Nuevo usuario asistente';
      this.messageButton = 'Crear';
    }
    this.form.get('idTypeDoc')?.valueChanges.subscribe((newIdTypeDoc) => {
      this.form.get('docId')?.setAsyncValidators([
        CustomValidators.docIdAsyncValidator(this.assistantService, Number(newIdTypeDoc), this.eventId)
      ]);
      this.form.get('docId')?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.typeDocService.get().subscribe(data => {
      this.listTypeDoc = data.payload;
    });
    this.clientService.get().subscribe(data => {
      this.listClient = data.payload;
    });
  }

  saveAssistant() {
    this.methodSaveAssistant();
  }

  methodSaveAssistant() {
    if (this.form.valid) {
      this.status = 'loading';
      const { idTypeDoc, docId, firstName, middleName, lastName,
        secondLastName, email, phoneNumber, birthday, gender, descriptChange } = this.form.getRawValue();
      this.userAssistant = {
        ... this.userAssistant,
        eventId: Number(this.eventId),
        idTypeDoc: Number(idTypeDoc),
        docId: docId,
        clientId: Number(this.clientId),
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        secondLastName: secondLastName,
        email: email,
        phoneNumber: phoneNumber === '' ? null : phoneNumber,
        birthday: Date.parse(birthday),
        gender: gender,
        infoVariable: ''
      }
      if (this.message === 'Nuevo usuario asistente') {
        this.assistantService.create(this.userAssistant, this.adminUserId).subscribe({
          next: (data) => {
            if (data) {
              this.toastrService.success('Registro completado');
              this.close();
              this.status = 'success';
            }
          },
          error: (error) => {
            console.error(error);
            this.status = 'failed';
          }
        });
      } else {
        this.assistantService.update(this.userAssistant, this.adminUserId).subscribe({
          next: (data) => {
            if (data) {
              this.toastrService.success('Registro editado');
              this.close();
              this.status = 'success';
            }
          },
          error: (error) => {
            console.log(error);
            this.status = 'failed';
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  onChangeListEvents(event: any) {
    const clientId = event.target.value;
    this.eventService.getByClientId(clientId).subscribe(data => {
      data.payload.map(item => {
        this.listEvent.push(item.event);
      })
    });
  }

  actualizarValidadorRequerido(condicion: boolean): void {
    const validators = condicion ? [Validators.required] : [];
    this.form.get('descriptChange')?.setValidators(validators);
    this.form.get('descriptChange')?.updateValueAndValidity();
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }
}
