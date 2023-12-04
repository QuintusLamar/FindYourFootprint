import React, { useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from 'react-leaflet';
import marker from "./mapMarker.svg";
import { Icon } from 'leaflet'

function Map({ routePoints }) {
  let testRoute;
  let startMarker;
  let endMarker;

  if (routePoints) {
    const flippedPoints = routePoints.map(p => [p[1], p[0]]);
    testRoute = (
      <Polyline
        positions={flippedPoints}
      />
    );
    const myIcon = new Icon({
      iconUrl: marker,
      iconSize: [32,32]
     })
    startMarker = <Marker position={flippedPoints[0]}  icon={myIcon}/>;
    endMarker = <Marker position={flippedPoints[flippedPoints.length - 1]}  icon={myIcon} />;
  }

  return (
    <MapContainer
      center={[33.775, -84.393]}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      {startMarker && startMarker}
      {endMarker && endMarker}
      <TileLayer
        url="https://api.mapbox.com/styles/v1/quintus-lamar/cloui2cuk00jx01qofx3w1x1k/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicXVpbnR1cy1sYW1hciIsImEiOiJjbG91ZDJwYzMwaHc5MmtvOW82cm9uZGhnIn0.VL3TfnwBOoiek2f8bxw4RQ"
        attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        id="mapbox/streets-v11"
        tileSize={512}
        zoomOffset={-1}
      />
      {testRoute && testRoute}
    </MapContainer>
  );
}


export default Map;
