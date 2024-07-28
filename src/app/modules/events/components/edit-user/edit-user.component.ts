import { Component, Inject } from '@angular/core';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AssistantService } from 'src/app/services/assistant.service';
import { RequestStatus } from 'src/app/models/request-status.model';
import { environment } from 'src/environments/environment';

interface InputData {
  attendant: IUserAssistant;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}


@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
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
export class EditUserComponent {

  status: RequestStatus = 'init';
  attendant: IUserAssistant = {
    userId: null,
    clientId: 0,
    loadListId: null,
    idTypeDoc: 0,
    docId: "",
    firstName: "",
    middleName: "",
    lastName: "",
    secondLastName: "",
    email: "",
    phoneNumber: "",
    birthday: 0,
    gender: "",
    rh: null,
    eventId: 0,
    agreedToTermsOfUse: null,
    viewAccessPoint: null,
    register: false,
    registration: 0,
    registerPoint: false,
    errorMessage: null,
    infoVariable: '',
    logdel: true
  };
  dialogAnimationState: 'in' | 'out' = 'in';
  adminUserId: number = 0;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private assistantService: AssistantService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.adminUserId = data.adminUserId;
      this.attendant = data.attendant;
      this.form.patchValue({
        docId: this.attendant.docId,
        nombre: this.attendant.firstName,
        apellido: this.attendant.lastName,
      })
    }
  }

  form = this.formBuilder.nonNullable.group({
    docId: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
  });

  saveUser() {
    if (this.form.valid) {
      this.status = 'loading';
      const { docId, nombre, apellido } = this.form.getRawValue();
      this.attendant = {
        ... this.attendant,
        docId: docId,
        firstName: nombre,
        lastName: apellido
      }
      this.assistantService.update(this.attendant, this.adminUserId).subscribe({
        next: (data) => {
          if (data.status === 'success') {
            this.toastrService.success('Registro actualizado');
            this.status = 'success';
            this.close();
          } else {
            this.toastrService.info(data.errorMessage.message);
            this.status = 'failed';
          }
        },
        error: (error) => {
          console.error(error);
          this.status = 'failed';
          this.toastrService.error(environment.messageError);
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }
}
