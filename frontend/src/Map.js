import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

function Map({ children }) {
  return (
    <MapContainer
        // center={[37.7749, -122.4194]}  // Cali testing
        center={[33.7708, -84.3861]}   // Atlanta coord
        zoom={12}
        style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://api.mapbox.com/styles/v1/quintus-lamar/cloui2cuk00jx01qofx3w1x1k/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicXVpbnR1cy1sYW1hciIsImEiOiJjbG91ZDJwYzMwaHc5MmtvOW82cm9uZGhnIn0.VL3TfnwBOoiek2f8bxw4RQ"
        attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
        id="mapbox/streets-v11"
        tileSize={512}
        zoomOffset={-1}
      />
      {children}
    </MapContainer>
  );
};

export default Map;