// Route.js
import React from 'react';
import { Polyline } from 'react-leaflet';

function Routes ({ waypoints }) {
  // console.log("Waypoints: ", waypoints)

  return (
    <div>
    {
      waypoints.slice(0, -1).map((value, index) => {
        let line = [waypoints[index], waypoints[index + 1]]
        return (
          <Polyline 
            positions={line}
            color="#3388ff"
            weight={5}
            opacity={0.7}
          />
        )
      })
    }
    </div>
    // <Polyline
      // positions={routeCoordinates}
      // color="#3388ff"
      // weight={5}
      // opacity={0.7}
    // />
  );
};

export default Routes;