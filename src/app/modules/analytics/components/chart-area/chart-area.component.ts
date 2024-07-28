import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from "@angular/core";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { IQuorumByTime } from "src/app/models/event.model";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.scss']
})
export class ChartAreaComponent implements OnInit, OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  chartOptions: ChartOptions;
  @Input() data: IQuorumByTime = {
    hora: [],
    media_hora: [],
    minuto: []
  };
  @Input() type: 'C' | 'U' = 'C';
  @Input() typeTime: 1 | 2 | 3 = 3;


  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Coeficiente",
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "category",
        categories: []
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

  ngOnInit(): void {
    this.initChart();
    setTimeout(() => (window as any).dispatchEvent(new Event('resize')), 1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.initChart();
    setTimeout(() => (window as any).dispatchEvent(new Event('resize')), 1);
  }

  initChart() {
    let coeficiente: any[] = [];
    let units: any[] = [];
    let fecha: any[] = [];
    if (this.data) {
      if (this.typeTime === 1 && this.data.minuto.length !== 0) {
        this.data.minuto.map(item => {
          coeficiente.push(item.avg_coefficient ? item.avg_coefficient : 0);
          units.push(item.avg_units ? item.avg_units : 0);
          fecha.push(item.date_minute)
        })
        if (this.type === 'C') {
          this.chartOptions = {
            series: [
              {
                name: "Coeficiente",
                data: coeficiente,
              },
            ],
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "datetime",
              categories: fecha
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm"
              }
            }
          };
        } else {
          this.chartOptions = {
            series: [
              {
                name: "Unidades",
                data: units,
              },
            ],
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "datetime",
              categories: fecha
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm"
              }
            }
          };
        }
      } else if (this.typeTime === 2 && this.data.media_hora.length !== 0) {
        this.data.media_hora.map(item => {
          coeficiente.push(item.avg_coefficient ? item.avg_coefficient : 0);
          units.push(item.avg_units ? item.avg_units : 0);
          fecha.push(item.date_minute)
        })
        if (this.type === 'C') {
          this.chartOptions = {
            series: [
              {
                name: "Coeficiente",
                data: coeficiente,
              },
            ],
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "datetime",
              categories: fecha
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm"
              }
            }
          };
        } else {
          this.chartOptions = {
            series: [
              {
                name: "Unidades",
                data: units,
              },
            ],
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "datetime",
              categories: fecha
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm"
              }
            }
          };
        }
      } else if (this.typeTime === 3 && this.data.media_hora.length !== 0) {
        this.data.hora.map(item => {
          coeficiente.push(item.avg_coefficient ? item.avg_coefficient : 0);
          units.push(item.avg_units ? item.avg_units : 0);
          fecha.push(item.date_minute + ':00')
        })
        if (this.type === 'C') {
          this.chartOptions = {
            series: [
              {
                name: "Coeficiente",
                data: coeficiente,
              },
            ],
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "datetime",
              categories: fecha
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm"
              }
            }
          };
        } else {
          this.chartOptions = {
            series: [
              {
                name: "Unidades",
                data: units,
              },
            ],
            chart: {
              height: 350,
              type: "area"
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "smooth"
            },
            xaxis: {
              type: "datetime",
              categories: fecha
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm"
              }
            }
          };
        }
      }
    }
  }

}
