
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Mapboxgl from 'mapbox-gl';
import * as turf from 'turf';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  
  map: Mapboxgl.Map | null = null;
  activity: boolean=false;

  tracking:any;
  latitude: number | null = null;
  longitude: number | null = null;
  coordinates: [number,number][] = [];

  preCoordinates:any;
  nowCoordinates:any;
  totalDistance: number = 0;

  option = {
    enableHighAccuracy: true
  };

  count: number = 0;

  constructor() {}
  
  ngOnInit() {
    (Mapboxgl as any).accessToken = environment.mapBoxKey;
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.longitude +","+ position.coords.latitude)
        this.map = new Mapboxgl.Map({
          container: 'map-mapBox', //ID container
          style: 'mapbox://styles/mapbox/dark-v11', // style container
          attributionControl: false, //disabilita tutti i controlli
          center: [position.coords.longitude, position.coords.latitude], //definisce la posizione di partenza
          zoom: 20 //definisce lo zoom con cui iniziare
        });
      })
  }

  public createLine() {
    this.map?.addSource('line' + this.count, {
      'type': 'geojson',
      'data': {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': this.coordinates
        },
        'properties':{}
      }
    });

    this.map?.addLayer({
      'id': 'line' + this.count,
      'type': 'line',
      'source': 'line' + this.count,
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#6F4BDB',
        'line-width': 7
      }
    });
    this.count++;
  }

  public start() {
    this.activity = true;
    this.tracking = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords.speed)
        this.coordinates.push([position.coords.longitude, position.coords.latitude]);
        this.map?.setCenter([position.coords.longitude, position.coords.latitude])
        console.log(this.coordinates)
        this.createLine();
        
        //Calcolo della distanza percorsa
        if (this.preCoordinates && this.nowCoordinates) {
          const distance = turf.distance(
            turf.point(this.preCoordinates),
            turf.point(this.nowCoordinates)
          );
          this.totalDistance += distance;
          console.log(this.totalDistance)
        }
        this.preCoordinates = this.nowCoordinates;
        this.nowCoordinates = [position.coords.longitude, position.coords.latitude];
        
        this.count ++;
      },error=>{}, this.option);
    }, 1000);
  }

  finish() {
    this.activity = false;
    clearInterval(this.tracking);
    this.createLine();
  }
      
}
