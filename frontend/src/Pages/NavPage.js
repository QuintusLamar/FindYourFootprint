import React, { useState, useEffect } from 'react';
import Map from '../Components/Map';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { Grid, IconButton, Typography, Box, Container, Paper, TextField, Button } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsBusFilledIcon from '@mui/icons-material/DirectionsBusFilled';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';

const InputForm = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  position: 'absolute',
  top: 0,
  left: 0,
  padding: 2,
  zIndex: 1000,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
});

const InputField = styled(TextField)({
  width: '100%',
  marginBottom: 2,
});

const SubmitButton = styled(Button)({
  width: '100%',
});

const CarbonInfo = styled('div')({
  position: 'absolute',
  top: 20,
  right: 20,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'row',
  '& > *:not(:last-child)': {
    marginRight: '12px', // Adjust the margin as needed
  },
});

const FullHeightContainer = styled(Container)({
  height: '100vh',
});

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
  const [selectedMode, setSelectedMode] = useState("drive");
  const [routePoints, setRoutePoints] = useState(null);

  const selectedStyle = {
    color: '#fff',
    bgcolor: '#9dc183'
  };

  useEffect(() => {
    if (selectedMode) {
      const event = { preventDefault: () => { } }
      submitRoute(event)
    }
  }, [selectedMode]);

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    const event = { preventDefault: () => { } }
    submitRoute(event) //TODO TEST IF YOU CAN REMOVE THIS AND FUNCTIONALITY STILL WORKS
  }


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


      try {
        let drivePoints = driveRoute.features[0].geometry.coordinates[0];
        setRoutePoints(drivePoints);
        let transitPoints = transitRoute.features[0].geometry.coordinates[0];
        let bicyclePoints = bicycleRoute.features[0].geometry.coordinates[0];
        let walkPoints = walkRoute.features[0].geometry.coordinates[0];

        switch (selectedMode) {
          case "drive":
            setRoutePoints(drivePoints)
            console.log("Drive route: ", routePoints);
            break;
          case "bus":
            setRoutePoints(transitPoints)
            console.log("Transit route: ", routePoints);
            break;
          case "bike":
            setRoutePoints(bicyclePoints)
            console.log("Bicycle route: ", routePoints);
            break;
          case "walk":
            setRoutePoints(walkPoints)
            break;
          default:
            setRoutePoints(drivePoints)
            console.log("Walk route: ", routePoints);
            break;
        }
      }
      catch (error) {
        //catches when there's the limbo stage between a null vlaue for route
        console.log(error)
      }
  
      let drivePoints = driveRoute.features[0].geometry.coordinates[0];
      let transitPoints = transitRoute.features[0].geometry.coordinates[0];
      let bicyclePoints = bicycleRoute.features[0].geometry.coordinates[0];
      let walkPoints = walkRoute.features[0].geometry.coordinates[0];


      // all the distances are in meters
      let driveDistance = (driveRoute.features[0].properties.distance)/1000 * 1.609
      let transitDistance = (transitRoute.features[0].properties.distance)/1000 * 1.609
      let bicycleDistance = (bicycleRoute.features[0].properties.distance)/1000 * 1.609
      let walkDistance = (walkRoute.features[0].properties.distance)/1000 * 1.609

      
      console.log("Drive route: ", drivePoints);
      console.log("Transit route: ", transitPoints);
      console.log("Bicycle route: ", bicyclePoints);
      console.log("Walk route: ", walkPoints);


      console.log("Drive Distance in miles: ", driveDistance);
      console.log("Transit Distance in miles: ", transitDistance);
      console.log("Bicycle Distance in miles: ", bicycleDistance);
      console.log("Walk Distance in miles: ", walkDistance);

      const currentRouteFormData = {
        routeDistance: driveDistance,
        vehicleId: "SUV"
      };

      try {
        const response = await fetch('http://127.0.0.1:5000/calculate_carboncost', {
          method: 'POST',  // Change method to POST
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentRouteFormData }),
        });
      
        console.log("RESPONSE:", response.text);
      
        if (response.ok) {
          console.log('Calculated carbon cost successfully');
          // Add any further actions after a successful update
        } else {
          console.error('Failed to calculate carbon cost successfully');
          // Handle error cases
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle network errors or other exceptions
      }
    

    }
    else {
      console.log("Starting address or ending address not entered");
    }
  }

  return (
    <FullHeightContainer sx={{ paddingTop: 10 }}>
      <Grid container spacing={0}>
        <InputForm sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0)', width: '380px' }}>
          <InputField
            type="text"
            placeholder="Enter starting address here"
            value={startAddr}
            onChange={(e) => setStartAddr(e.target.value)}
            required={true}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 1)', width: '100%', mb: 1, p: 0, borderRadius: '4px' }}
          />
          <InputField
            type="text"
            placeholder="Enter ending address here"
            value={endAddr}
            onChange={(e) => setEndAddr(e.target.value)}
            required={true}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 1)', width: '100%', mb: 2, p: 0, borderRadius: '4px' }}
          />
          <SubmitButton 
            variant="contained" 
            onClick={submitRoute}
            sx={{ width: '1%', mb: 2, p: 1 }}
          >
            <SearchIcon/>
          </SubmitButton>
        </InputForm>

        <CarbonInfo>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <IconButton sx={selectedMode === "drive" ? selectedStyle : null}>
              <DirectionsCarIcon onClick={() => handleModeSelect("drive")}></DirectionsCarIcon>
            </IconButton>

            <Typography textAlign={'center'}>3600lbs of CO2</Typography>
            <Typography textAlign={'center'}>3600 minutes</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <IconButton sx={selectedMode === "bus" ? selectedStyle : null}>
              <DirectionsBusFilledIcon onClick={() => handleModeSelect("bus")}></DirectionsBusFilledIcon>
            </IconButton>

            <Typography textAlign={'center'}>3600lbs of CO2</Typography>
            <Typography textAlign={'center'}>3600 minutes</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <IconButton sx={selectedMode === "bike" ? selectedStyle : null}>
              <DirectionsBikeIcon onClick={() => handleModeSelect("bike")}></DirectionsBikeIcon>
            </IconButton>

            <Typography textAlign={'center'}>3600lbs of CO2</Typography>
            <Typography textAlign={'center'}>3600 minutes</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            <IconButton sx={selectedMode === "walk" ? selectedStyle : null}>
              <DirectionsWalkIcon onClick={() => handleModeSelect("walk")}></DirectionsWalkIcon>
            </IconButton>

            <Typography textAlign={'center'}>3600lbs of CO2</Typography>
            <Typography textAlign={'center'}>3600 minutes</Typography>
          </Box>
        </CarbonInfo>

        <Paper
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1, // Adjust zIndex as needed
          }}
        >
          <Map routePoints={routePoints} />
        </Paper>
      </Grid>

    </FullHeightContainer>
  );
};

export default NavPage;