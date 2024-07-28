import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-confirm-charge',
  templateUrl: './confirm-charge.component.html',
  styleUrls: ['./confirm-charge.component.scss'],
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
export class ConfirmChargeComponent {

  dialogAnimationState: 'in' | 'out' = 'in';

  constructor(
    private dialogRef: DialogRef<boolean>,
  ) { }

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
