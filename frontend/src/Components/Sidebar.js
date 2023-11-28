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
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useNavigate } from "react-router-dom";


function Sidebar() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const sideBarItems = [
    { "text": "View Profile", "navigation": "ViewProfile", "element": <AccountBoxOutlinedIcon></AccountBoxOutlinedIcon> },
    { "text": "Edit Profile", "navigation": "EditProfile", "element": <EditOutlinedIcon></EditOutlinedIcon> },
  ]

  function clicked(event) {
    const text = event.target.outerText;
    const replacedText = text.replace(/\s/g, '');

    if (replacedText === "ViewProfile") {
      navigate("/Profile")
    }
    else {
      setTitle(text);
      navigate("/Profile/" + replacedText);
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
              {/* <ListItemButton onClick={(event) => {
                  console.log("Key: ", event)
                }}
                selected={key.text===title}
              > */}
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