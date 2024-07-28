import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import { IAdminChart } from 'src/app/models/event.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
};

interface Serires {
  name: string,
  data: number[]
}

@Component({
  selector: 'app-chart-colum-admin',
  templateUrl: './chart-colum-admin.component.html',
  styleUrls: ['./chart-colum-admin.component.scss']
})
export class ChartColumAdminComponent implements OnInit, OnChanges{
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;
  @Input() chartAdmin: IAdminChart[] = [];

  constructor() {
    this.chartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          // endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
          text: ""
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return '';
          }
        }
      }
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
  }

  ngOnInit(): void {
    this.initChart();
  }

  initChart() {
    let categories: string[] = [];
    let series: Serires[] = [
      {
        name: 'Ingresos',
        data: []
      },
      {
        name: 'Salidas',
        data: []
      }
    ];
    if(this.chartAdmin.length !== 0){
      this.chartAdmin.map(item => {
        categories.push(item.name ? item.name : 'Null');
        series[0].data.push(item.entry ? item.entry : 0);
        series[1].data.push(item.exit ? item.exit : 0);
      });
    }
    this.chartOptions = {
      series: series,
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: categories
      },
      yaxis: {
        title: {
          text: "Ingresos/Salidas"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString();
          }
        }
      }
    };
  }
}
