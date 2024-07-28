import { Component, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { IControlUser } from 'src/app/models/control.model';

interface InputData {
  controls: IControlUser[];
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-missing-controls',
  templateUrl: './missing-controls.component.html',
  styleUrls: ['./missing-controls.component.scss'],
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
export class MissingControlsComponent {
  controls: IControlUser[] = [];
  dialogAnimationState: 'in' | 'out' = 'in';

  constructor(
    private dialogRef: DialogRef<OutputData>,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.controls = data.controls;
    }
  }

  infoDoc(control: IControlUser) {
    if (control.user) {
      return (control.user.idTypeDoc === 1 ? 'CC' : 'NIT') + ' ' + control.user.docId;
    }
    return '';
  }

  infoName(control: IControlUser) {
    if (control.user) {
      return control.user.firstName + ' ' + control.user.lastName;
    }
    return '';
  }

  infoPhone(control: IControlUser) {
    if (control.user) {
      return control.user.phoneNumber;
    }
    return '';
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }
}
