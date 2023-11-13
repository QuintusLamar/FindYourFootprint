import React, { useState, useEffect } from 'react';
import Map from './Map';
import Route from './Route';
import Routes from './Routes';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import './App.css';

function App () {
  const [startAddr, setStartAddr] = useState("");
  const [endAddr, setEndAddr] = useState("");
  const [isRoute, setIsRoute] = useState(false);
  const [route, setRoute] = useState([]);

  const api_key = "48fbefd89de548768e248393b9881b79"

  function addressToString(addr) {
    let newAddr = addr.replaceAll(",", "%2C");
    let addrStr = newAddr.replaceAll(" ", "%20")
    return addrStr
  }

  function getPoints(url) {
    var requestOptions = {
      method: 'GET',
    };

    return fetch(url, requestOptions)
      .then(response => response.json())
      .catch(error => console.log("Error: ", error))
  }

  function getAve(features) {
    let finalCoord =[0, 0];
    features.forEach(feature => {
      finalCoord[0] = finalCoord[0] + feature.geometry.coordinates[1];
      finalCoord[1] = finalCoord[1] + feature.geometry.coordinates[0];
    })
    finalCoord[0] = finalCoord[0] / features.length;
    finalCoord[1] = finalCoord[1] / features.length;

    return finalCoord;
  }

  async function submitRoute() {
    if (startAddr != "" && endAddr != "") {
      let startAddrStr = addressToString(startAddr);
      let startUrl = "https://api.geoapify.com/v1/geocode/search?text=" + startAddrStr + "&apiKey=" + api_key;
      let endAddrStr = addressToString(endAddr);
      let endUrl = "https://api.geoapify.com/v1/geocode/search?text=" + endAddrStr + "&apiKey=" + api_key;

      let startResult = await getPoints(startUrl)
      let endResult = await getPoints(endUrl)

      let startCoord = getAve(startResult.features);
      let endCoord = getAve(endResult.features);

      let final_url = `https://api.geoapify.com/v1/routing?waypoints=${startCoord.join(',')}|${endCoord.join(',')}&mode=drive&details=instruction_details&apiKey=${api_key}`;

      fetch(final_url)
        .then(res => res.json())
        .then(result => {
          setRoute(result.features[0].geometry.coordinates)
          setIsRoute(true);
        })
    }
    else {
      console.log("Starting address or ending address not entered")
    }
  }

  const routeCoordinates = [
    [37.7749, -122.4194],
    [37.5475, -122.3897],
  ];

  // 38 Upper Montagu Street, Westminster W1H 1LJ, United Kingdom

  // Pencil building address
  // 600 W Peachtree St NW, Atlanta, GA 30308
  // Pencil building Lat/Lng
  // 33.7707, -84.3866

  // Coke building address
  // 1 Coca Cola Plz NW, Atlanta, GA 30313
  // Coke building Lat/Lng
  // 33.7628 -84.3928
  

    return (
      <div>
        <div className="TopBar">

          {/* Buttons/symbols should go here? */}
          <div className="Misc">

          </div>

          {/* <div className="InputBars">
            <input
              className="ChildInput"
              type="text"
              value={startAddr}
              onChange={(e) => setStartAddr(e.target.value)}
            />

            <input
              className="ChildInput"
              type="text"
              value={endAddr}
              onChange={(e) => setEndAddr(e.target.value)}
            />

            <button onClick={submitRoute}> Submit Route </button> */}

            
          {/* </div> */}
          <div className="inputBars">
            <form>
              <input
                className="ChildInput"
                type="text"
                placeholder="Enter starting address here"
                value={startAddr}
                onChange={(e) => setStartAddr(e.target.value)}
                required={true}
              />

              <input
                className="ChildInput"
                type="text"
                placeholder="Enter ending address here"
                value={endAddr}
                onChange={(e) => setEndAddr(e.target.value)}
                required={true}
              />
              <input type="submit" value="Search" onClick={submitRoute}/>
            </form>
          </div>

          {/* Routes and their symbols will be displayed here */}
          <div className="Routes">

          </div>

        </div>
        <Map>
          {/* <Route routeCoordinates={routeCoordinates} /> */}
          <Routes waypoints={route}/>
        </Map>
      </div>
    );
};

export default App;

