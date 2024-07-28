import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { OutputData } from 'src/app/models/data.model';

interface InputData {
  title: string;
  messageButton: string;
}

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
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

export class DeleteComponent {

  deleteReason: string = '';
  title: string = '';
  messageButton: string = 'Eliminar';
  dialogAnimationState: 'in' | 'out' = 'in';
  showError: boolean = false;

  constructor(
    private dialogRef: DialogRef<OutputData>,
    @Inject(DIALOG_DATA) data: InputData
  ) {
    if (data) {
      if(data.messageButton){
        this.messageButton = data.messageButton;
      }
      this.title = data.title;
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close(
        {
          message: '',
          rta: false
        }
      );
    }, 600);
  }

  onDelete() {
    if (this.deleteReason.trim() !== '') {
      this.dialogAnimationState = 'out';
      setTimeout(() => {
        this.dialogRef.close(
          {
            message: this.deleteReason,
            rta: true
          }
        );
      }, 600);
    } else {
      this.showError = true;
    }
  }
}
