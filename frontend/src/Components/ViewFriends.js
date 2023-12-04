import { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from '../Components/Sidebar';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PersonRemoveOutlinedIcon from '@mui/icons-material/PersonRemoveOutlined';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  p: 4,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const textStyle = {
  mt: '5px',
  mb: '5px',
}

const btnBarStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  mt: '2',
}

function ViewFriends() {
  const [friends, setFriends] = useState([
    "Sharan Sathish",
    "Utkarsh NSR",
    "Sarang Pujari",
    "Manoj Niverthi"
  ]);

  const [selected, setSelected] = useState("");
  const [removeOpen, setRemoveOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");

  const closeModal = (type) => {
    if (type === "remove") {
      setRemoveOpen(false);
    } else if (type === "add") {
      setAddOpen(false);
    }
    setSelected("");
  };

  const removeFriend = (value) => {
    setSelected(value);
    setRemoveOpen(true);
  };

  const submitRemoval = () => {
    const updatedFriends = friends.filter((friend) => friend !== selected);
    setFriends(updatedFriends);
    // API call to remove friend here
    setSelected("");
    setRemoveOpen(false);
  };

  const addFriend = () => {
    setSelected("");
    setFname("");
    setLname("");
    setEmail("");
    setAddOpen(true);
  };

  const submitAddition = () => {
    if (email != "") {
      const newFriend = `${fname} ${lname}`;
      setFriends([...friends, newFriend]);
      // API call to add friend here
      setAddOpen(false);
    }
    else {
      alert("Email required")
    }
  };

  const submitForm = async () => {
    // API call to update profile here
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar />

      <Box elevation={3} sx={{ margin: '16px', padding: '16px', width: '200px' }}>
        <List dense>
          {friends.map((value) => (
            <ListItem key={value} disablePadding>
              <PersonOutlineOutlinedIcon />
              <ListItemText primary={value} />
              <Button onClick={() => removeFriend(value)}>
                <PersonRemoveOutlinedIcon />
              </Button>
            </ListItem>
          ))}
        </List>
        <Button onClick={addFriend}>
          Add friend
        </Button>
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

          <Typography sx={{mb: '10px'}}>
            Are you sure you want to remove {selected} as a friend?
          </Typography>

          <Box sx={btnBarStyle}>
            <Button onClick={() => closeModal("remove")} variant="contained" color="error" mr={2} sx={{ml: '5px'}}>
              Do not remove
            </Button>
            <Button onClick={submitRemoval} variant="contained" color="success" mr={2} sx={{ml: '5px'}}>
              Remove
            </Button>
          </Box>
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
          <Box sx={btnBarStyle}>
            <Button onClick={() => closeModal("add")} variant="contained" color="error" mr={2} sx={{ml: '5px'}}>
              Cancel
            </Button>

            <Button onClick={submitAddition} variant="contained" color="success" sx={{ml: '5px'}}>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default ViewFriends;