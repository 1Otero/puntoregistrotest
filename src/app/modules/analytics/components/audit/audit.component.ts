import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IAuditoria } from 'src/app/models/access-point.model';

@Component({
  selector: 'app-audit',
  templateUrl: './audit.component.html',
  styleUrls: ['./audit.component.scss']
})
export class AuditComponent implements OnInit, OnChanges{
  
  @Input() listAudit: IAuditoria[] = [];
  displayedItems: IAuditoria[] = [];
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
    this.totalPages = Math.ceil(this.listAudit.length / this.itemsPerPage);
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
    this.displayedItems = this.listAudit;
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.displayedItems.length);
    this.displayedItems = this.displayedItems.slice(startIndex, endIndex);
    this.updateTotalPages();
  }
}
