import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grafico-dona',
  templateUrl: './grafico-dona.component.html',
  styleUrls: ['./grafico-dona.component.css']
})
export class GraficoDonaComponent implements OnInit {
  // Doughnut
  @Input("ChartLabels") doughnutChartLabels: string[] = [];
  @Input("ChartData") doughnutChartData: number[][] = [];
  @Input("ChartType") doughnutChartType: string = '';

  constructor() { }

  ngOnInit() {
  }

}
