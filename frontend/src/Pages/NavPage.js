import React, { useState, useEffect } from 'react';
import Map from '../Components/Map';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import '../App.css';

// Sample coordinates below

// Pencil building
// Address: 600 W Peachtree St NW, Atlanta, GA 30308
// Lat/Lng: 33.7707, -84.3866

// Coca Cola building
// Address: 1 Coca Cola Plz NW, Atlanta, GA 30313
// Lat/Lng: 33.7628 -84.3928

function NavPage() {
  const [startAddr, setStartAddr] = useState("600 W Peachtree St NW, Atlanta, GA 30308");
  const [endAddr, setEndAddr] = useState("1 Coca Cola Plz NW, Atlanta, GA 30313");
  const [drivePoints, setDrivePoints] = useState(null);


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

  function getRoute(startCoord, endCoord, mode) {
    let final_url = `https://api.geoapify.com/v1/routing?waypoints=${startCoord.join(',')}|${endCoord.join(',')}&mode=${mode}&details=instruction_details&apiKey=${api_key}`;
    return fetch(final_url)
      .then(res => res.json())
  }

  //TODO LOOK INTO IF THIS AVERAGE IS CORRECT, sometimes it gives multiple routes 
  function getAve(features) {
    let finalCoord = [0, 0];
    features.forEach(feature => {
      finalCoord[0] = finalCoord[0] + feature.geometry.coordinates[1];
      finalCoord[1] = finalCoord[1] + feature.geometry.coordinates[0];
    })
    finalCoord[0] = finalCoord[0] / features.length;
    finalCoord[1] = finalCoord[1] / features.length;

    return finalCoord;
  }

  async function submitRoute(e) {
    e.preventDefault();
    if (startAddr != "" && endAddr != "") {
      let startAddrStr = addressToString(startAddr);
      let startUrl = "https://api.geoapify.com/v1/geocode/search?text=" + startAddrStr + "&apiKey=" + api_key;
      let endAddrStr = addressToString(endAddr);
      let endUrl = "https://api.geoapify.com/v1/geocode/search?text=" + endAddrStr + "&apiKey=" + api_key;

      let startResult = await getPoints(startUrl);
      let endResult = await getPoints(endUrl);

      let startCoord = getAve(startResult.features);
      let endCoord = getAve(endResult.features);

      let driveRoute = await getRoute(startCoord, endCoord, "drive");
      let transitRoute = await getRoute(startCoord, endCoord, "transit");
      let bicycleRoute = await getRoute(startCoord, endCoord, "bicycle");
      let walkRoute = await getRoute(startCoord, endCoord, "walk");

      let drivePoints = driveRoute.features[0].geometry.coordinates[0];
      setDrivePoints(drivePoints);
      let transitPoints = transitRoute.features[0].geometry.coordinates[0];
      let bicyclePoints = bicycleRoute.features[0].geometry.coordinates[0];
      let walkPoints = walkRoute.features[0].geometry.coordinates[0];

      console.log("Drive route: ", drivePoints);
      console.log("Transit route: ", transitPoints);
      console.log("Bicycle route: ", bicyclePoints);
      console.log("Walk route: ", walkPoints);
    }
    else {
      console.log("Starting address or ending address not entered");
    }
  }

  return (
    <div>
      <div className="TopBar">

        {/* Buttons/symbols should go here? */}
        <div className="Misc">

        </div>

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
            <input type="submit" value="Search" onClick={submitRoute} />
          </form>
        </div>

        {/* Routes and their symbols will be displayed here */}
        <div className="Routes">

        </div>

      </div>
      <Map
        drivePoints={drivePoints}>
      </Map>
    </div>
  );
};

export default NavPage;