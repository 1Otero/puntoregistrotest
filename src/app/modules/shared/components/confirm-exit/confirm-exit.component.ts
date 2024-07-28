import { Component, Inject } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ITicketUserRegister } from 'src/app/models/assistant.model';

interface InputData {
  title: string;
  tickets: ITicketUserRegister[];
}

@Component({
  selector: 'app-confirm-exit',
  templateUrl: './confirm-exit.component.html',
  styleUrls: ['./confirm-exit.component.scss'],
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
export class ConfirmExitComponent {

  dialogAnimationState: 'in' | 'out' = 'in';
  message: string = '';
  tickets: ITicketUserRegister[] = [];

  constructor(
    private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.message = data.title;
      this.tickets = data.tickets;
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close(
        false
      );
    }, 600);
  }

  onDelete() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close(
        true
      );
    }, 600);
  }

}
