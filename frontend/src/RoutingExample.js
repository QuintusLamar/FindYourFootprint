import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

function RoutingExample() {
  const [startLatitude, setStartLatitude] = useState('');
  const [startLongitude, setStartLongitude] = useState('');
  const [endLatitude, setEndLatitude] = useState('');
  const [endLongitude, setEndLongitude] = useState('');
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const mapRef = useRef();

  // This gives and issue, a different way of mapping needs to be done
  const createRoutineMachineLayer = (startPoint, endPoint) => {
    console.log("start point: ", startPoint)
    console.log("end point: ", endPoint)
    const instance = L.Routing.control({
      waypoints: [
        // L.latLng(startPoint),
        // L.latLng(endPoint)
        {lat: 51.5007, lng: -0.1246},
        {lat: 51.5014, lng: -0.1419}
        // 51.5014° N, 0.1419
      ],
      // router: L.Routing.mapbox('pk.eyJ1IjoicXVpbnR1cy1sYW1hciIsImEiOiJjbG91ZDJwYzMwaHc5MmtvOW82cm9uZGhnIn0.VL3TfnwBOoiek2f8bxw4RQ')
      router: L.Routing.mapbox('pk.eyJ1IjoicXVpbnR1cy1sYW1hciIsImEiOiJjbG91Y3czdWswZjMxMmpuejNmdTNzN3VqIn0.SPEoFoq__U-LbPFbam0FaQ')
    });
    // .addTo(mapRef);
    
    console.log(instance)
    return instance;
  };

  useEffect(() => {
    if (startLatitude && startLongitude) {
      setStartPoint({ lat: parseFloat(startLatitude), lng: parseFloat(startLongitude) });
    } else {
      setStartPoint(null);
    }

    if (endLatitude && endLongitude) {
      setEndPoint({ lat: parseFloat(endLatitude), lng: parseFloat(endLongitude) });
    } else {
      setEndPoint(null);
    }
  }, [startLatitude, startLongitude, endLatitude, endLongitude]);

  return (
    <div>
      <div>
        <label>Start Latitude: </label>
        <input
          type="number"
          value={startLatitude}
          onChange={(e) => setStartLatitude(e.target.value)}
        />
        <label>Start Longitude: </label>
        <input
          type="number"
          value={startLongitude}
          onChange={(e) => setStartLongitude(e.target.value)}
        />
      </div>
      <div>
        <label>End Latitude: </label>
        <input
          type="number"
          value={endLatitude}
          onChange={(e) => setEndLatitude(e.target.value)}
        />
        <label>End Longitude: </label>
        <input
          type="number"
          value={endLongitude}
          onChange={(e) => setEndLongitude(e.target.value)}
        />
      </div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '600px' }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {startPoint && <Marker position={startPoint}><Popup>Start Point</Popup></Marker>}
        {endPoint && <Marker position={endPoint}><Popup>End Point</Popup></Marker>}
      </MapContainer>
      {/* <button onClick={createRoutingControl}>Find Route</button> */}
      <button onClick={createRoutineMachineLayer}> Find Route </button>
    </div>
  );
};

export default RoutingExample;
