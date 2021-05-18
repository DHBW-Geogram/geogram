export interface GeogramPosition {
  coords: {
    accuracy: number;
    altitude: number | undefined;
    altitudeAccuracy: number | undefined;
    heading: number | undefined;
    latitude: number;
    longitude: number;
    speed: number | undefined;
  };
  timestamp: number;
  position?: string;
}
