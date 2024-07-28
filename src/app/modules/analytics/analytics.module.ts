import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { AnalyticsComponent } from './pages/analytics/analytics.component';
import { ChartColumnComponent } from './components/chart-column/chart-column.component';
import { ChartColumnVComponent } from './components/chart-column-v/chart-column-v.component';
import { ChartPieComponent } from './components/chart-pie/chart-pie.component';
import { ChartAreaComponent } from './components/chart-area/chart-area.component';
import { SharedModule } from '../shared/shared.module';
import { ChartColumAdminComponent } from './components/chart-colum-admin/chart-colum-admin.component';
import { ChartLineComponent } from './components/chart-line/chart-line.component';
import { MissingControlsComponent } from './components/missing-controls/missing-controls.component';
import { AuditComponent } from './components/audit/audit.component';


@NgModule({
  declarations: [
    AnalyticsComponent,
    ChartColumnComponent,
    ChartColumnVComponent,
    ChartPieComponent,
    ChartAreaComponent,
    ChartColumAdminComponent,
    ChartLineComponent,
    MissingControlsComponent,
    AuditComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    NgApexchartsModule,
    MatTabsModule,
    MatRadioModule,
    FormsModule,
    SharedModule,
    MatIconModule
  ]
})
export class AnalyticsModule { }
