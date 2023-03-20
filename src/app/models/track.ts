
export class Track {
    type: string;
    features: Features;
    constructor(features: Features) {
        this.type = "FeatureCollection"
        this.features = features
    }
  }

  export class Features {
    type: string;
    geometry: Geometry;
    constructor(geometry : Geometry) {
        this.type = "Feature"
        this.geometry = geometry
    }
  }

   export class Geometry {
    type: string;
    coordinates: Array<any>;
    constructor(coordinates: Array<Array<Number>>) {
        this.type = "LineString";
        this.coordinates = coordinates;
    }
  }