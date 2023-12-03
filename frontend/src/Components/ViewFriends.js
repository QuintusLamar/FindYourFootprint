import { useState } from 'react';
import '../Style/App.css';
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
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ViewFriends({ userFriends }) {
  const [friends, setFriends] = useState([
    "Sharan Sathish",
    "Utkarsh NSR",
    "Sarang Pujari",
    "Manoj Niverthi"
  ]);

  const [selected, setSelected] = useState("")

  const [open, setOpen] = useState(false);

  function removeFriend(value) {
    setSelected(value)
    setOpen(true)
  }

  function closeModal() {
    setOpen(false)
    setSelected("")
  }

  function submitRemoval() {
    // Make API call to remove friend here
    // Maybe also remove from friends list?
    setSelected("")
  }

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <Sidebar />

      <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {friends.map((value) => {
        const labelId = {value};
        return (
          <ListItem key={value} disablePadding>
            <PersonOutlineOutlinedIcon />

            <ListItemText id={labelId} primary={value} />

            <Button onClick={() => {removeFriend(value)}}>
              <PersonRemoveOutlinedIcon/>
            </Button>
          </ListItem>
        );
      })}
    </List>
    
    <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography>
            Are you sure you want to remove {selected} as a friend?
          </Typography>
          
          <Button onClick={closeModal}>
            Do not remove
          </Button>

          <Button onClick={() => {submitRemoval()}}>
            Remove
          </Button>
        </Box>
      </Modal>

    </Box>
  )
}

export default ViewFriends;