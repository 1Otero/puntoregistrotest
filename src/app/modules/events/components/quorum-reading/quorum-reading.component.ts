import { Dialog } from '@angular/cdk/dialog';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IQuorumReadingByUser, IQuorumReadingUser } from 'src/app/models/quorum-reading.model';
import { RequestStatus } from 'src/app/models/request-status.model';
import { QuorumReadingTicketsComponent } from '../quorum-reading-tickets/quorum-reading-tickets.component';

@Component({
  selector: 'app-quorum-reading',
  templateUrl: './quorum-reading.component.html',
  styleUrls: ['./quorum-reading.component.scss']
})
export class QuorumReadingComponent implements OnInit, OnChanges {

  @Input() quorumReading: IQuorumReadingByUser[] = [];
  @Input() status: RequestStatus = 'init';
  displayedItems: IQuorumReadingByUser[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  pageSizeOptions: number[] = [5, 10];
  totalPages: number = 0;

  constructor(
    private dialog: Dialog
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDisplayedItems();
  }

  ngOnInit(): void {
    this.updateDisplayedItems();
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.quorumReading.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedItems();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedItems();
    }
  }

  changePageSize() {
    const firstItemIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentPage = Math.floor(firstItemIndex / this.itemsPerPage) + 1;
    this.updateTotalPages();
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    this.updateDisplayedItems();
  }

  updateDisplayedItems() {
    this.displayedItems = this.quorumReading;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.displayedItems.length);
    this.displayedItems = this.displayedItems.slice(startIndex, endIndex);
    this.updateTotalPages();
  }

  openTickets(tickets: IQuorumReadingUser[]) {
    this.dialog.open(QuorumReadingTicketsComponent, {
      data: {
        tickets: tickets
      }
    })
  }
}
