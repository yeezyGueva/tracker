import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-generic-analysis',
  templateUrl: './generic-analysis.component.html',
  styleUrls: ['./generic-analysis.component.scss']
})
export class GenericAnalysisComponent implements OnInit {

  public chart: any;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
  }

  createChart(){
    //VADO A CREARE DEGLI ELEMENTI PER I TOOLTIP
    // const labelCustom = (tooltipItem:any) => {
    //   const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];
    //       const monthIndex = tooltipItem[0].dataIndex;
    //       const monthName = monthNames[monthIndex];
    //       return monthName;
    // }
    //CREAZIONE DEL GRAFICO TYPE = radar
    this.chart = new Chart('myChart', {
      type: 'radar',
      data: {
        labels: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
        datasets: [{
          label: 'n° passeggiate',
          data: [1,2,5,0,8,9,2,6,15,1,25,16],
          backgroundColor: 'rgba(61, 179, 145, 0.2)',
          borderColor: 'rgba(61, 179, 145, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 5,
            angleLines:{
              color: 'rgba(255, 255, 255, 0.1)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)' // colore delle linee di sfondo
            },
            pointLabels: {
              color: "rgba(255, 255, 255, 1)"
            },
            ticks: {
              color: "",
              backdropColor:"rgba(255, 255, 255, 0)",
            }
          }
        },
        plugins: {
          tooltip: {
            yAlign: 'bottom',
            displayColors: false,
            backgroundColor:"rgba(47, 47, 60, 1)",
            // callbacks: {
            //   label: labelCustom
            // }
          }        
        }
      }
    });
  }

  
}
