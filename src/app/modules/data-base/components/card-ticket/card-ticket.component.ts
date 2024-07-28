import { Component, Input } from '@angular/core';
import { ITicketUser } from '../../../../models/assistant.model';
import { ITypeDoc } from '../../../../models/type-doc.model';

@Component({
  selector: 'app-card-ticket',
  templateUrl: './card-ticket.component.html',
  styleUrls: ['./card-ticket.component.scss']
})
export class CardTicketComponent {

  @Input() tickets: ITicketUser[] = [];
  typeDoc: string = '';
  listTypeDoc: ITypeDoc[] = [];

}
