import { Dialog } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUserAssistant } from 'src/app/models/assistant.model';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-info-client',
  templateUrl: './info-client.component.html',
  styleUrls: ['./info-client.component.scss']
})
export class InfoClientComponent {

  @Input() attendant: IUserAssistant = {
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
  }
  @Output() bacK = new EventEmitter<boolean>(true);
  @Input() tickets: number = 0;
  @Input() coeficiente: number = 0;
  @Input() unidades: number = 0;
  @Input() deviceType: number = 0;
  @Input() ticketsByUser: number = 0;
  @Output() ingress = new EventEmitter<number>();
  @Input() ticketsDisponibles: number = 0;
  @Input() numeroControles: number = 0;
  @Input() isRegister: 'Registro' | 'Salida' = 'Registro';
  @Input() showInfoClient: number = 0;
  @Input() formValid: boolean = false;
  @Input() adminUserId: number = 0;

  constructor(
    private dialog: Dialog
  ) { }

  onBack() {
    this.bacK.emit(true);
  }

  onIngress(type: number) {
    if (this.deviceType === 1) {
      if (this.ticketsDisponibles === this.numeroControles) {
        if (this.showInfoClient === 1) {
          if (!this.formValid) {
            this.ingress.emit(3);
          } else {
            this.ingress.emit(type);
          }
        } else {
          this.ingress.emit(type);
        }
      } else {
        this.ingress.emit(2);
      }
    } else {
      if (this.showInfoClient === 1) {
        if (!this.formValid) {
          this.ingress.emit(3);
        } else {
          this.ingress.emit(type);
        }
      } else {
        this.ingress.emit(type);
      }
    }
  }

  onEdit() {
    this.dialog.open(EditUserComponent, {
      data: {
        attendant: this.attendant,
        adminUserId: this.adminUserId,
      }
    })
  }

}
