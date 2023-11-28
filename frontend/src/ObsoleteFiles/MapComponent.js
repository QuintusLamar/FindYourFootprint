import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

const MapComponent = ({ waypoints, children }) => {
  console.log("Waypoints again: ", waypoints)
  const map = useMap();

  useEffect(() => {
    if (waypoints.length >= 2) {
      L.Routing.control({
        waypoints: waypoints,
      }).addTo(map);

      // Pass the map instance to the parent component
      // onMapInstance(map);
    }
  }, [waypoints]);

  return children;
};

export default MapComponent;