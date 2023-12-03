import { useState } from "react";
import axios from "axios";
import "../Style/App.css";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function EditProfile(ck) {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [address, setAddress] = useState("");
  // const [city, setCity] = useState("");
  // const [state, setState] = useState("");
  // const [phone, setPhone] = useState("");

  const submitForm = async () => {
    console.log("First: ", first);
    console.log("Last: ", last);
    console.log("Vehicle: ", vehicle);
    console.log("Email: ", email);
    console.log("Password: ", password);
    // console.log("Address: ", address);
    // console.log("City: ", city);
    // console.log("State: ", state);
    // console.log("Phone: ", phone);

    const updateProfileFormData = {
      name: first + last,
      email: email,
      password: password,
      vehicle: vehicle,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/update_profile",
        {
          updateProfileFormData,
          "Access-Control-Allow-Origin": "*",
          token: ck["ck"]["token"],
        }
      );

      if (response.ok) {
        console.log("Profile updated successfully");
        // Add any further actions after a successful update
      } else {
        console.error("Failed to update profile");
        // Handle error cases
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Sidebar />

      <Box sx={{ ml: "10px" }}>
        <h1> Edit Profile </h1>
        <TextField
          required={true}
          value={first}
          onChange={(event) => {
            setFirst(event.target.value);
          }}
          label="First Name"
          placeholder="First Name"
          variant="outlined"
          sx={{ width: "25%", ml: "2.5%", mr: "2.5%", mb: "2%" }}
        />
        <TextField
          required={true}
          value={last}
          onChange={(event) => {
            setLast(event.target.value);
          }}
          label="Last Name"
          placeholder="Last Name"
          variant="outlined"
          sx={{ width: "25%", ml: "2.5%", mr: "2.5%", mb: "2%" }}
        />
        <TextField
          required={true}
          value={vehicle}
          onChange={(event) => {
            setVehicle(event.target.value);
          }}
          label="Primary Vehicle"
          placeholder="Honda Civic"
          variant="outlined"
          sx={{ width: "25%", ml: "2.5%", mr: "2.5%", mb: "2%" }}
        />

        {/* <TextField
          required={true}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
          }}
          label="Email"
          placeholder="name@gmail.com"
          variant="outlined"
          sx={{ width: "40%", ml: "2.5%", mr: "2.5%" }}
        /> */}
        <TextField
          required={true}
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
          label="Password"
          placeholder="123abc"
          variant="outlined"
          sx={{ width: "40%", ml: "2.5%", mr: "2.5%" }}
        />
        {/* <TextField 
          value={address}
          onChange={(event) => {
            setAddress(event.target.value)
          }}
          label="Address"
          placeholder="600 W Peachtree St NW"
          variant="outlined" 
          sx={{width:"85%", ml:"2.5%", mr:"2.5%", mt:"2%", mb:"2%"}}
        /> */}

        {/* <TextField 
          value={city}
          onChange={(event) => {
            setCity(event.target.value)
          }}
          label="City"
          placeholder="Atlanta"
          variant="outlined" 
          sx={{width:"25%", ml:"2.5%", mr:"2.5%"}}
        />
        <TextField 
          value={state}
          onChange={(event) => {
            setState(event.target.value)
          }}
          label="State"
          placeholder="GA"
          variant="outlined" 
          sx={{width:"25%", ml:"2.5%", mr:"2.5%"}}
        />
        <TextField 
          value={phone}
          onChange={(event) => {
            setPhone(event.target.value)
          }}
          label="Phone Number"
          placeholder="(123) 456-7890"
          variant="outlined" 
          sx={{width:"25%", ml:"2.5%", mr:"2.5%"}}
        /> */}

        <Button variant="outlined" onClick={submitForm}>
          {" "}
          Submit{" "}
        </Button>
      </Box>
    </Box>
  );
}

export default EditProfile;
