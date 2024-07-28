import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IAccessPointTicketData } from 'src/app/models/access-point.model';

@Component({
  selector: 'app-exit-type',
  templateUrl: './exit-type.component.html',
  styleUrls: ['./exit-type.component.scss']
})
export class ExitTypeComponent implements OnInit, OnChanges{

  @Input() listTickets: IAccessPointTicketData[] = [];
  displayedItems: IAccessPointTicketData[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  pageSizeOptions: number[] = [5, 10];
  totalPages: number = 0;
  @Input() type: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    this.updateDisplayedItems();
  }

  ngOnInit(): void {
    this.updateDisplayedItems();
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.listTickets.length / this.itemsPerPage);
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
    this.displayedItems = this.listTickets;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.displayedItems.length);
    this.displayedItems = this.displayedItems.slice(startIndex, endIndex);
    this.updateTotalPages();
  }
}
