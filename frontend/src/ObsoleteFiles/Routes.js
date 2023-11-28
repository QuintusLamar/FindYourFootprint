// This file is likely unnecessary, one idea I had was to show several lines between each pair of points, but for some reason 
// it doesn't work in the following code

import React from 'react';
import { Polyline } from 'react-leaflet';

function Routes ({ waypoints }) {

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
  );
};

export default Routes;