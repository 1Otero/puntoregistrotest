import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  template: `
  <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit{
  title = 'punto-registro';

  ngOnInit(): void {
    initFlowbite();
  }
}
