
import { Component, HostListener, OnInit } from '@angular/core';
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

  tracking:any;
  latitude: number | null = null;
  longitude: number | null = null;
  coordinates: [number,number][] = [];

  preCoordinates:any;
  nowCoordinates:any;
  totalDistance: number = 0;

  error:any;
  coordinateLong:number = 0;
  coordinateLat:number = 0;

  //COUNTER
  count: number = 0;

  //FLAG
  activity: boolean=false;
  smallHeight:boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.smallHeight = window.innerHeight <= 850;
  }

  constructor() {}
  
  ngOnInit() {
    if (!this.map) {
    (Mapboxgl as any).accessToken = environment.mapBoxKey;
      navigator.geolocation.getCurrentPosition((position) => {
        this.coordinateLong = position.coords.longitude;
        this.coordinateLat = position.coords.latitude;
        this.map = new Mapboxgl.Map({
        container: 'map-mapBox', //ID container
        style: 'mapbox://styles/mapbox/dark-v11', // style container
        attributionControl: false, //disabilita tutti i controlli
        center: [this.coordinateLong, this.coordinateLat], //definisce la posizione di partenza
        zoom: 20, //definisce lo zoom con cui iniziare
      });
      } ,error=>{this.error = error}, {enableHighAccuracy: true});
  }

  
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
        'line-color': '#3DB391',
        'line-width': 7
      }
    });
    this.count++;
  }

  start() {
    this.coordinateLong = 0;
    this.coordinateLat = 0;
    this.activity = true;
    this.tracking = navigator.geolocation.watchPosition(position => {
      this.coordinateLong = position.coords.longitude;
      this.coordinateLat = position.coords.latitude;
      if (position.coords.accuracy <= 5) {
        this.coordinates.push([position.coords.longitude, position.coords.latitude]);
        this.createLine();
  
        //Calcolo della distanza percorsa
        if (this.preCoordinates && this.nowCoordinates) {
          const distance = turf.distance(
            turf.point(this.preCoordinates),
            turf.point(this.nowCoordinates),
            "meters"
          );
          this.totalDistance += distance;
          console.log(this.totalDistance)
        }
        this.preCoordinates = this.nowCoordinates;
        this.nowCoordinates = [position.coords.longitude, position.coords.latitude];
  
        this.count ++;
      }
    }, error => {
      this.error = error;
    }, {enableHighAccuracy: true});
  }
  finish() {
    this.activity = false;
    navigator.geolocation.clearWatch(this.tracking);
    this.createLine();
  }
      
}
