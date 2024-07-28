import { Component, Input } from '@angular/core';
import { IClient } from 'src/app/models/client.model';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {

  @Input() clients: IClient[] = [];

}
