import { useState } from 'react';
import '../App.css';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { useNavigate } from "react-router-dom";


function Sidebar() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const sideBarItems = [
    {"text": "Edit Profile", "element": <EditOutlinedIcon></EditOutlinedIcon>},
    {"text": "Notification", "element": <NotificationsNoneOutlinedIcon></NotificationsNoneOutlinedIcon>},
    {"text": "Security", "element": <LockOutlinedIcon></LockOutlinedIcon>},
    {"text": "Appearance", "element": <SettingsOutlinedIcon></SettingsOutlinedIcon>},
    {"text": "Help", "element": <HelpOutlineOutlinedIcon></HelpOutlineOutlinedIcon>}
  ]

  function clicked(event) {
    setTitle(event.target.outerText)
    
    if (event.target.outerText != "Edit Profile") {
      navigate("/Profile/" + event.target.outerText);
    }
    else {
      navigate("/Profile/EditProfile");
    }
  }


  return (
    <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />

        <List>
          {sideBarItems.map((key) => (
            <ListItem key={key.text} disablePadding>
              {/* Something about this needs to be updated, the state takes too long to set */}
              <ListItemButton onClick={clicked} selected={key.text === title}>
                {key.element}
              <ListItemText primary={key.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
  )
}

export default Sidebar;