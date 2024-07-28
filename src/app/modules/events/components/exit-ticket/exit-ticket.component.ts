import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAccessPointTicketData } from 'src/app/models/access-point.model';
import { AccessPointService } from 'src/app/services/access-point.service';

@Component({
  selector: 'app-exit-ticket',
  templateUrl: './exit-ticket.component.html',
  styleUrls: ['./exit-ticket.component.scss']
})
export class ExitTicketComponent implements OnInit, OnChanges, OnDestroy{

  listTickets: IAccessPointTicketData[] = [];
  listTicketsActive: IAccessPointTicketData[] = [];
  listTicketsInactive: IAccessPointTicketData[] = [];
  subscription: Subscription;
  @Input() eventId: number = 0;
  eventIdThis: number = 0;

  constructor(
    private accessPointService: AccessPointService,
  ){}

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getInfo();
    this.subscription = this.accessPointService.refresh.subscribe(() => {
      this.getInfo();
    })    
  }

  ngOnInit(): void {
    this.getInfo();
    this.subscription = this.accessPointService.refresh.subscribe(() => {
      this.getInfo();
    })
  }

  getInfo(){
    this.accessPointService.getAccessPointTicketByEvent(this.eventId).subscribe({
      next:(data) => {
        if(data.status === 'success'){
          this.listTickets = data.payload;
          this.listTicketsActive = this.listTickets.filter(item => item.status);
          this.listTicketsInactive = this.listTickets.filter(item => !item.status);
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
