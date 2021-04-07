export interface Image {
  description: string;
  location: {
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
  };
  title: string;
  url: string;
  user: string;
  distance: number | undefined;
  timestamp: number;
}