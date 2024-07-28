import { Component, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IClient, IClientCreate } from 'src/app/models/client.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClientService } from 'src/app/services/client.service';
import { environment } from 'src/environments/environment';

interface InputData {
  client: IClient;
  isSave: boolean;
  adminUserId: number;
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-save-client',
  templateUrl: './save-client.component.html',
  styleUrls: ['./save-client.component.scss'],
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
export class SaveClientComponent {

  status: RequestStatus = 'init';
  message: 'Nuevo cliente' | 'Editar cliente' | '' = '';
  messageButton: 'Crear' | 'Editar' | '' = '';
  client: IClientCreate = {
    clientId: 0,
    name: '',
    nit: '',
    modifiedUserId: 0,
    vottingTypeId: 1,
    url: '',
  };
  clientId: number = 0;
  dialogAnimationState: 'in' | 'out' = 'in';
  adminUserId: number = 0;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private clientService: ClientService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    this.adminUserId = data.adminUserId;
    if (data.isSave) {
      this.message = 'Editar cliente';
      this.messageButton = 'Editar';
    } else {
      this.message = 'Nuevo cliente';
      this.messageButton = 'Crear';
    }
  }

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    nit: ['', [Validators.required]],
    url: ['', [Validators.required]],
  });

  saveClient() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, nit, url } = this.form.getRawValue();
      this.client = {
        ... this.client,
        name: name,
        nit: nit,
        url: url,
      }
      if (this.message === 'Nuevo cliente') {
        this.clientService.create(this.client, this.adminUserId).subscribe({
          next: (data) => {
            if (data.status === 'success') {
              this.status = 'success';
              this.toastrService.success('Cliente registrado correctamente');
              this.close();
            } else {
              this.status = 'failed';
              this.toastrService.info(data.errorMessage.message);
            }
          },
          error: (error) => {
            console.error(error);
            this.status = 'failed';
            this.toastrService.error(environment.messageError);
          }
        })
      } else {
        // this.eventService.update(this.userAssistant).subscribe(data => {
        //   if (data) {
        //     this.toastrService.success('Registro editado');
        //     this.close();
        //   }
        // });
      }

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
