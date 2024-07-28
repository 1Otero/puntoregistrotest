import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import { IQuorumByTime } from 'src/app/models/event.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};


@Component({
  selector: 'app-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss']
})
export class ChartLineComponent implements OnChanges {

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: ChartOptions;
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
          name: "",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: []
      }
    };
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
          coeficiente.push(item.avg_coefficient ? parseFloat(item.avg_coefficient.toFixed(2)) : 0);
          units.push(item.avg_units ? parseFloat(item.avg_units.toFixed(2)) : 0);
          fecha.push(item.date_minute)
        })
        if (this.type === 'C') {
          this.chartOptions = {
            series: [
              {
                name: "Coeficiente",
                data: coeficiente
              }
            ],
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: fecha
            }
          };
        } else {
          this.chartOptions = {
            series: [
              {
                name: "Unidades",
                data: units
              }
            ],
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: fecha
            }
          };
        }
      } else if (this.typeTime === 2 && this.data.media_hora.length !== 0) {
        this.data.media_hora.map(item => {
          coeficiente.push(item.avg_coefficient ? parseFloat(item.avg_coefficient.toFixed(2)) : 0);
          units.push(item.avg_units ? parseFloat(item.avg_units.toFixed(2)) : 0);
          fecha.push(item.date_minute)
        })
        if (this.type === 'C') {
          this.chartOptions = {
            series: [
              {
                name: "Coeficiente",
                data: coeficiente
              }
            ],
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: fecha
            }
          };
        } else {
          this.chartOptions = {
            series: [
              {
                name: "Unidades",
                data: units
              }
            ],
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: fecha
            }
          };
        }
      } else if (this.typeTime === 3 && this.data.media_hora.length !== 0) {
        this.data.hora.map(item => {
          coeficiente.push(item.avg_coefficient ? parseFloat(item.avg_coefficient.toFixed(2)) : 0);
          units.push(item.avg_units ? parseFloat(item.avg_units.toFixed(2)) : 0);
          fecha.push(item.date_minute + ':00')
        })
        if (this.type === 'C') {
          this.chartOptions = {
            series: [
              {
                name: "Coeficiente",
                data: coeficiente
              }
            ],
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: fecha
            }
          };
        } else {
          this.chartOptions = {
            series: [
              {
                name: "Unidades",
                data: units
              }
            ],
            chart: {
              height: 350,
              type: "line",
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: "straight"
            },
            title: {
              text: "",
              align: "left"
            },
            grid: {
              row: {
                colors: ["#f3f3f3", "transparent"],
                opacity: 0.5
              }
            },
            xaxis: {
              categories: fecha
            }
          };
        }
      }
    }
  }
}
