import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  Pane,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix marker icons */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* Force resize */
const FixMap = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 300);
  }, [map]);
  return null;
};

/* Auto-fit */
const FitBounds = ({ pickup, dropoff }) => {
  const map = useMap();
  useEffect(() => {
    if (pickup && dropoff) {
      map.fitBounds(
        [
          [pickup.lat, pickup.lng],
          [dropoff.lat, dropoff.lng],
        ],
        { padding: [60, 60] }
      );
    }
  }, [pickup, dropoff, map]);
  return null;
};

const CarismaMap = ({ pickup, dropoff }) => {
  if (!pickup || !dropoff) return null;

  return (
    <MapContainer
      center={[pickup.lat, pickup.lng]}
      zoom={12}
      style={{ height: "100%", width: "100%" }}
    >
      <FixMap />
      <FitBounds pickup={pickup} dropoff={dropoff} />

      {/* Map tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers */}
      <Marker position={[pickup.lat, pickup.lng]} />
      <Marker position={[dropoff.lat, dropoff.lng]} />

    
      <Pane name="routePane" style={{ zIndex: 1000 }}>
        {/* Glow */}
        <Polyline
          positions={[
            [pickup.lat, pickup.lng],
            [dropoff.lat, dropoff.lng],
          ]}
          pathOptions={{
            color: "#007bff",
            weight: 14,
            opacity: 0.25,
          }}
        />

        {/* Main route */}
        <Polyline
          positions={[
            [pickup.lat, pickup.lng],
            [dropoff.lat, dropoff.lng],
          ]}
          pathOptions={{
            color: "#007bff",
            weight: 6,
            opacity: 1,
          }}
        />
      </Pane>
    </MapContainer>
  );
};

export default CarismaMap;
