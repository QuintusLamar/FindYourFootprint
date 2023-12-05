import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Modal from '@mui/material/Modal';
import Sidebar from '../Components/Sidebar';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  p: 4,
  bgcolor: 'background.paper',
  boxShadow: 24,
};

const textStyle = {
  mt: '5px',
  mb: '5px',
};

const btnBarStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: '2',
};

function ViewFriends({ck, removeCookie, setAuthenticated}) {
  const [friends, setFriends] = useState([
    { "name": "Sharan Sathish", "email": "ss@gmail.com" },
    { "name": "Utkarsh NSR", "email": "un@gmail.com" },
    { "name": "Sarang Pujari", "email": "sp@gmail.com" },
    { "name": "Manoj Niverthi", "email": "mn@gmail.com" },
  ]);

  const [selected, setSelected] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");

  const removeFriend = (value) => {
    setSelected(value);
    setRemoveOpen(true);
  };

  const closeModal = (type) => {
    if (type === "remove") {
      setRemoveOpen(false);
    } else if (type === "add") {
      setAddOpen(false);
    }
    setSelected("");
  };

  const submitRemoval = async () => {
    try {
      // Prepare the data for the POST request
      const data = {
        token: ck['ck']['token'],
        email: selected.email
      };
  
      // Make the POST request to the remove_friend endpoint
      const response = await fetch('http://127.0.0.1:5000/remove_friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        console.log('Friend removed successfully');
      } else {
        console.error('Error removing friend:', response.statusText);
        // Handle error cases
      }
    } catch (error) {
      console.error('Error:', error);
      // Handle network errors or other exceptions
    }
  
    // Update the state and close the modal
    const updatedFriends = friends.filter((friend) => friend !== selected);
    setFriends(updatedFriends);
    setSelected('');
    setRemoveOpen(false);
  };

  const addFriend = () => {
    setSelected("");
    setAddOpen(true);
  };

  const submitAddition = async () => {
    if (email !== "") {
      const newFriend = { "name": `${fname} ${lname}`, "email": `${email}` };
      setFriends([...friends, newFriend]);
  
      // Prepare the data for the POST request
      const data = {
        token: ck['ck']['token'],  
        email: email
      };

      try {
        // Make the fetch request
        const response = await fetch("http://127.0.0.1:5000/add_friend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          console.log("Friend added successfully");
        } else {
          console.error("Error adding friend:", response.statusText);
          // Handle error cases
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle network errors or other exceptions
      }
  
      setAddOpen(false);
    } else {
      alert("Email required");
    }
  };
    
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar setAuthenticated={setAuthenticated} removeCookie={removeCookie}/>
      <Box sx={{ margin: 'auto', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ alignItems: "center", display: "flex", justifyContent: "center" }} color={'white'} fontSize={48}>
          Friends
        </Typography>
        <Paper elevation={3} sx={{ margin: '16px', padding: '16px', width: '400px' }}>
          <List dense>
            {friends.map((value) => (
              <ListItem key={value.name} disablePadding>
                <PersonOutlineOutlinedIcon sx={{ mr: '10px' }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1">{value.name}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1">{value.email}</Typography>
                  </Grid>
                </Grid>
                <Button onClick={() => removeFriend(value)}>
                  <PersonRemoveOutlinedIcon />
                </Button>
              </ListItem>
            ))}
          </List>
          
          <Box sx={{display: "flex", justifyContent: "right"}}>
            <Button variant="contained" onClick={addFriend} sx={{mr:"20px"}}>
              Add friend
            </Button>
          </Box>

        </Paper>
      </Box>

      <Modal
        open={removeOpen}
        onClose={() => closeModal("remove")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" mb={2}>
            Remove friend
          </Typography>

          <Typography sx={{ mb: '10px' }}>
            Are you sure you want to remove {selected.name} as a friend?
          </Typography>

          <Stack direction="row" spacing={2} sx={btnBarStyle}>
            <Button onClick={() => closeModal("remove")} variant="contained" color="error">
              Do not remove
            </Button>
            <Button onClick={submitRemoval} variant="contained" color="success">
              Remove
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={addOpen}
        onClose={() => closeModal("add")}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h5" mb={2}>
//         </Paper>
//         <Box sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
//           <Button variant="contained" onClick={addFriend} sx={{ mr: "55px" }}>
            Add friend
          </Button>
        </Box>

        {/* Remove friend modal */}
        <Modal
          open={removeOpen}
          onClose={() => closeModal("remove")}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, bgcolor: 'white' }}>
            <Typography variant="h5" mb={2}>
              Remove friend
            </Typography>

            <Typography sx={{ mb: '10px' }}>
              Are you sure you want to remove {selected.name} as a friend?
            </Typography>

            <Stack direction="row" spacing={2} sx={btnBarStyle}>
              <Button onClick={() => closeModal("remove")} variant="contained" color="error">
                Do not remove
              </Button>
              <Button onClick={submitRemoval} variant="contained" color="success">
                Remove
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Add friend modal */}
        <Modal
          open={addOpen}
          onClose={() => closeModal("add")}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...modalStyle, bgcolor: 'white' }}>
            <Typography variant="h5" mb={2}>
              Add friend
            </Typography>

            <TextField
              value={fname}
              onChange={(event) => setFname(event.target.value)}
              label="First name"
              placeholder="Jack"
              variant="outlined"
              fullWidth
              mb={2}
              sx={textStyle}
            />

            <TextField
              value={lname}
              onChange={(event) => setLname(event.target.value)}
              label="Last name"
              placeholder="Johnson"
              variant="outlined"
              fullWidth
              mb={2}
              sx={textStyle}
            />

            <TextField
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              label="Email"
              placeholder="JJ@gmail.com"
              variant="outlined"
              fullWidth
              mb={2}
              sx={textStyle}
            />

            <Stack direction="row" spacing={2} sx={btnBarStyle}>
              <Button onClick={() => closeModal("add")} variant="contained" color="error">
                Cancel
              </Button>
              <Button onClick={submitAddition} variant="contained" color="success">
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
}

export default ViewFriends;
