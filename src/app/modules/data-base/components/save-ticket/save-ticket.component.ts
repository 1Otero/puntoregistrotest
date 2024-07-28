import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RequestStatus } from '../../../../models/request-status.model';
import { ITicket } from '../../../../models/ticket.model';
import { TicketService } from '../../../../services/ticket.service';
import { CustomValidators } from 'src/app/utils/validators';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface InputData {
  ticket: ITicket;
  isSave: boolean;
  eventId: number;
  clientId: number;
  isFree: boolean;
  numberIsFree: number;
  deviceType: number;
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-save-ticket',
  templateUrl: './save-ticket.component.html',
  styleUrls: ['./save-ticket.component.scss'],
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
export class SaveTicketComponent {

  status: RequestStatus = 'init';
  message: 'Nuevo voto' | 'Editar voto' | '' = '';
  messageButton: 'Crear' | 'Editar' | '' = '';
  ticket: ITicket = {
    ticketId: 0,
    eventId: 0,
    clientId: 0,
    loadListId: 0,
    key1: '',
    key2: '',
    groupId: '',
    description: '',
    coefficient: 0,
    units: 0,
    voteOfflineId: null,
    logdel: true,
    available: true,
    register: 0,
    token: 0,
    numControl: 0,
    status: 1
  };
  form: FormGroup;
  key1: string = '';
  key2: string = '';
  showValidateKey1Key2: boolean = false;
  isFree: boolean = false;
  numberIsFree: number = 0;
  dialogAnimationState: 'in' | 'out' = 'in';
  deviceType: number = 0;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private ticketService: TicketService,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    this.isFree = data.isFree;
    this.numberIsFree = data.numberIsFree;
    this.deviceType = data.deviceType;
    if (data.isSave) {
      this.ticket = data.ticket;
      if(this.deviceType === 1){
        this.form = this.formBuilder.nonNullable.group({
          key1: ['', [Validators.required]],
          key2: ['', [Validators.required]],
          description: [''],
          coefficient: ['', [Validators.required]],
          units: ['', [Validators.required]],
          descriptChange: ['', Validators.required],
          control: [''],
          token: ['', [], [CustomValidators.tokenTicketEditAsyncValidator(ticketService, this.ticket.token, this.ticket.eventId)]]
        });
      } else {
        this.form = this.formBuilder.nonNullable.group({
          key1: ['', [Validators.required]],
          key2: ['', [Validators.required]],
          description: [''],
          coefficient: ['', [Validators.required]],
          units: ['', [Validators.required]],
          descriptChange: ['', Validators.required],
          control: [''],
          token: ['', [], [CustomValidators.tokenTicketEditAsyncValidator(ticketService, this.ticket.token, this.ticket.eventId)]]
        });
      }
      this.actualizarValidadorRequerido(true);
      this.message = 'Editar voto';
      this.messageButton = 'Editar';
      this.form.patchValue({
        key1: this.ticket.key1,
        key2: this.ticket.key2,
        description: this.ticket.description,
        coefficient: this.ticket.coefficient.toString(),
        units: this.ticket.units.toString(),
        token: this.ticket.token,
        control: this.ticket.numControl === 0 ? '' : this.ticket.numControl
      });
      this.key1 = this.ticket.key1;
      this.key2 = this.ticket.key2;
    } else {
      this.message = 'Nuevo voto';
      this.messageButton = 'Crear';
      this.ticket = {
        ... this.ticket,
        eventId: Number(data.eventId),
        clientId: data.clientId,
      }
      this.form = this.formBuilder.nonNullable.group({
        key1: ['', [Validators.required]],
        key2: ['', [Validators.required]],
        description: [''],
        coefficient: ['', [Validators.required]],
        units: ['', [Validators.required]],
        descriptChange: ['', Validators.required],
        control: [''],
        token: ['', [], [CustomValidators.tokenTicketAsyncValidator(ticketService, this.ticket.eventId)]]
      });
      this.actualizarValidadorRequerido(false);
    }
  }

  saveTicket() {
      this.methodSaveTicket();
  }

  methodSaveTicket() {
    if (this.form.valid && !this.showValidateKey1Key2) {
      this.status = 'loading';
      const { key1, key2, description, coefficient, units, descriptChange, token } = this.form.getRawValue();
      this.ticket = {
        ... this.ticket,
        key1: key1,
        key2: key2,
        description: description,
        coefficient: Number(coefficient),
        units: Number(units),
        token: Number(token)
      }
      if (this.message === 'Nuevo voto') {
        this.ticketService.create(this.ticket).subscribe({
          next: (data) => {
            if (data) {
              if (data.status === 'error') {
                this.toastrService.info(data.errorMessage.message);
                this.status = 'failed';
              } else {
                this.toastrService.success('Registro completado');
                this.close();
                this.status = 'success';
              }
            }
          },
          error: (error) => {
            console.log(error);
            this.status = 'failed';
          }
        });
      } else {
        this.ticketService.update(this.ticket).subscribe(data => {
          if (data) {
            this.toastrService.success('Registro editado');
            this.close();
          }
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  actualizarValidadorRequerido(condicion: boolean): void {
    const validators = condicion ? [Validators.required] : [];
    this.form.get('descriptChange')?.setValidators(validators);
    this.form.get('descriptChange')?.updateValueAndValidity();
  }

  changeKey1(event: any) {
    this.key1 = event.target.value;
    this.validateKeyKey2();
  }

  changeKey2(event: any) {
    this.key2 = event.target.value;
    this.validateKeyKey2();
  }

  validateKeyKey2() {
    if (this.key1 && this.key2) {
      if (this.message === 'Nuevo voto') {
        this.ticketService.validateKeyKey2(this.key1, this.key2, this.ticket.eventId).subscribe(data => {
          if (data) {
            if (data.payload) {
              this.showValidateKey1Key2 = true;
            } else {
              this.showValidateKey1Key2 = false;
            }
          }
        })
      } else {
        this.ticketService.validateKeyKey2Edit(this.ticket.key1, this.ticket.key2, this.key1, this.key2, this.ticket.eventId).subscribe(data => {
          if (data) {
            if (data.payload) {
              this.showValidateKey1Key2 = true;
            } else {
              this.showValidateKey1Key2 = false;
            }
          }
        })
      }
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }
}
