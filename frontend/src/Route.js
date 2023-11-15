// This file is unneeded, it just creates a straight line that doesn't consider roads or routes in any way

import React from 'react';
import { Polyline } from 'react-leaflet';

function Route ({ routeCoordinates }) {
  return (
    <Polyline
      positions={routeCoordinates}
      color="#3388ff"
      weight={5}
      opacity={0.7}
    />
  );
};

export default Route;