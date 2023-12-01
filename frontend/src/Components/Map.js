import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';

function Map({ routePoints }) {
  // const [testRoute, setTestRoute] = useState(<></>);
  // const [isTest, setisTest] = useState(false);


  // let testRoute = <Polyline />;
  let testRoute;
  if (routePoints) {
    const flippedPoints = routePoints.map(p => [p[1], p[0]]);
    testRoute = (<Polyline
      positions={flippedPoints}
    />)
    // setisTest(true);
  }

  return (
    <MapContainer
      // center={[37.7749, -122.4194]}  // Cali testing
      center={[33.775, -84.393]}   // Atlanta coord
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false} // Set zoomControl to false to hide zoom buttons
    >
      <TileLayer
        url="https://api.mapbox.com/styles/v1/quintus-lamar/cloui2cuk00jx01qofx3w1x1k/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicXVpbnR1cy1sYW1hciIsImEiOiJjbG91ZDJwYzMwaHc5MmtvOW82cm9uZGhnIn0.VL3TfnwBOoiek2f8bxw4RQ"
        attribution="Map data &copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors, <a href=&quot;https://creativecommons.org/licenses/by-sa/2.0/&quot;>CC-BY-SA</a>, Imagery &copy; <a href=&quot;https://www.mapbox.com/&quot;>Mapbox</a>"
        id="mapbox/streets-v11"
        tileSize={512}
        zoomOffset={-1}
      />
      {testRoute && testRoute}
    </MapContainer>
  );
};

export default Map;