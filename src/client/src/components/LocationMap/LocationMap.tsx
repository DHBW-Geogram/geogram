import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { GeogramPosition } from "../../model/GeogramPosition";
import "leaflet/dist/leaflet.css";
import "./LocationMap.css";

const LocationMap: React.FC<{ location: GeogramPosition }> = ({ location }) => {
  return (
    <MapContainer
      center={[location.coords.latitude, location.coords.longitude]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "20vh", width: "100vh" }}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.coords.latitude, location.coords.longitude]}>
        <Popup>Current Position.</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LocationMap;
