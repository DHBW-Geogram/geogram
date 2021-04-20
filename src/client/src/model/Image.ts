export interface Image {
  description: string;  
  likes: number;
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
    position: string | undefined;
  };
  title: string;
  url: string;
  user: string;
  distance: number | undefined;
  timestamp: number;
  id: string;
}
