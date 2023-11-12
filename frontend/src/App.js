import React, { useState, useEffect } from 'react';
import Map from './Map';
import Route from './Route';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './App.css';
// import {
//   setKey,
//   setDefaults,
//   setLanguage,
//   setRegion,
//   fromAddress,
//   setLocationType,
//   geocode,
//   RequestType,
// } from "react-geocode";

function App () {

  const [startAddr, setStartAddr] = useState("");
  const [endAddr, setEndAddr] = useState("");

  const [startCoordinates, setStartCoordinates] = useState([])
  const [endCoordinates, setEndCoordinates] = useState([])
  // const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [address, setAddress] = useState("");

  function testFunc() {
    console.log("Start: ", startCoordinates)

    console.log("End: ", endCoordinates)
  }

  function addressToString(addr) {
    let newAddr = addr.replaceAll(",", "%2C");
    let addrStr = newAddr.replaceAll(" ", "%20")
    // let newString = originalString.replace("color", "colour");
    return addrStr
  }

  function convertAddresses() {
    var requestOptions = {
      method: 'GET',
    };
    var api_key = "48fbefd89de548768e248393b9881b79";

    var startAddrStr = addressToString(startAddr)
    var endAddrStr = addressToString(endAddr)
    var startUrl = "https://api.geoapify.com/v1/geocode/search?text=" + startAddrStr + "&apiKey=" + api_key;
    var endUrl = "https://api.geoapify.com/v1/geocode/search?text=" + endAddrStr + "&apiKey=" + api_key;
    
    fetch(startUrl, requestOptions)
      .then(response => response.json())
      .then(result => {
        setStartCoordinates(result.features[0].geometry.coordinates)
        console.log("Result: ", result)
      })
      .catch(error => console.log('error', error));

    fetch(endUrl, requestOptions)
      .then(response => response.json())
      .then(result => {
        setEndCoordinates(result.features[0].geometry.coordinates)
        console.log("Result: ", result)
      })
      .catch(error => console.log('error', error));

  }

  function submitRoute() {
    // setRouteCoordinates([startPoint[0], startPoint[1]], [endPoint[0], endPoint[1]])
    // fromAddress("Eiffel Tower")
    //   .then(({ results }) => {
    //     const { lat, lng } = results[0].geometry.location;
    //     console.log(lat, lng);
    //   })
    //   .catch(console.error);

    convertAddresses()   
  }
  const routeCoordinates = [
    [37.7749, -122.4194],
    [37.5475, -122.3897],
  ];

  // 38 Upper Montagu Street, Westminster W1H 1LJ, United Kingdom
  // 349 Decatur St SE, Atlanta, GA 30312
  // 1 Coca Cola Plz NW, Atlanta, GA 30313
  

    return (
      <div>
        <div className="TopBar">

          {/* Buttons/symbols should go here? */}
          <div className="Misc">

          </div>

          <div className="InputBars">
            <input
              className="ChildInput"
              type="text"
              value={startAddr}
              onChange={(e) => setStartAddr(e.target.value)}
              // onChange={(e) => changeAddr(e.target.value)}
            />

            <input
              className="ChildInput"
              type="text"
              value={endAddr}
              onChange={(e) => setEndAddr(e.target.value)}
            />

            <button onClick={submitRoute}> Submit Route </button>

            
          </div>

          {/* Routes and their symbols will be displayed here */}
          <div className="Routes">
            <button onClick={testFunc}> Test </button>
          </div>

        </div>
        <Map>
          <Route routeCoordinates={routeCoordinates} />
        </Map>
      </div>
    );
};

export default App;

