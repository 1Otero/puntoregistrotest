import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { IClient } from 'src/app/models/client.model';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss']
})
export class ListClientComponent implements OnInit, OnChanges{

  @Input() clients: IClient[] = [];
  clientsFilter: IClient[] = [];
  @Input() clientNameFilter: string = '';
  clientNameFilterThis: string = '';
  displayedItems: IClient[] = [];
  sortedData: IClient[];
  currentPage = 1;
  itemsPerPage = 10;
  pageSizeOptions: number[] = [5, 10, 20, 30, 50, 75];
  totalPages: number = 0;

  constructor(
    private router: Router,
  ){}

  ngOnInit(): void {
    this.clientsFilter = this.clients;
    this.updateDisplayedTickets();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['clientNameFilter']){
      this.clientNameFilterThis = this.clientNameFilter;
      this.applyFilter();
    }
  }

  updateDisplayedTickets() {
    let filteredItems = this.clientsFilter;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, filteredItems.length);
    this.displayedItems = filteredItems.slice(startIndex, endIndex);
    this.updateTotalPages();
  }

  updateTotalPages() {
    this.totalPages = Math.ceil(this.clientsFilter.length / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedTickets();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedTickets();
    }
  }

  applyFilter() {
    this.clientsFilter = this.clients.filter(event => event.name ? event.name.toLowerCase().includes(this.clientNameFilterThis.toLowerCase()) : '').reverse();
    this.updateDisplayedTickets();
  }
  
  changePageSize() {
    const firstItemIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.currentPage = Math.floor(firstItemIndex / this.itemsPerPage) + 1;
    this.updateTotalPages();
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
    this.updateDisplayedTickets();
  }

  sortData(sort: Sort) {
    const data = this.clients;
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nombre':
          return compare((a.name), (b.name), isAsc);
        case 'nit':
          return compare(a.nit, b.nit, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
