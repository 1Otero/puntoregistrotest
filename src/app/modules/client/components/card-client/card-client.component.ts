import { Component, Input } from '@angular/core';
import { IClient } from 'src/app/models/client.model';

@Component({
  selector: 'app-card-client',
  templateUrl: './card-client.component.html',
  styleUrls: ['./card-client.component.scss']
})
export class CardClientComponent {

  @Input() client: IClient = {
    clientId: 0,
    name: '',
    nit: '',
    creationDate: '',
    modifiedUserId: 0,
    vottingTypeId: 0,
    url: '',
  }

}
