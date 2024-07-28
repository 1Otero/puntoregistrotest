import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { IDocumentHistoryError } from 'src/app/models/document-history.model';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface InputData {
  errors: IDocumentHistoryError[];
}

interface OutputData {
  rta: boolean;
}
@Component({
  selector: 'app-list-error-initial-charge',
  templateUrl: './list-error-initial-charge.component.html',
  styleUrls: ['./list-error-initial-charge.component.scss'],
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
export class ListErrorInitialChargeComponent {

  listError:IDocumentHistoryError[] = [];
  dialogAnimationState: 'in' | 'out' = 'in';

  constructor(
    private dialogRef: DialogRef<OutputData>,
    @Inject(DIALOG_DATA) data: InputData
  ){
    if(data){
      this.listError = data.errors;
    }
  }

  close() {
    this.dialogAnimationState = 'out';
    setTimeout(() => {
      this.dialogRef.close();
    }, 600);
  }
}
