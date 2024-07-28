import { Component, Inject } from '@angular/core';
import { IQuorumReadingUser } from 'src/app/models/quorum-reading.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';


interface InputData {
  tickets: IQuorumReadingUser[];
}

interface OutputData {
  rta: boolean;
}

@Component({
  selector: 'app-quorum-reading-tickets',
  templateUrl: './quorum-reading-tickets.component.html',
  styleUrls: ['./quorum-reading-tickets.component.scss'],
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
export class QuorumReadingTicketsComponent {

  tickets: IQuorumReadingUser[] = [];
  dialogAnimationState: 'in' | 'out' = 'in';

  constructor(
    private dialogRef: DialogRef<OutputData>,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      this.tickets = data.tickets;
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }
}
