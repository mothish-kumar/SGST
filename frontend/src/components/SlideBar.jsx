import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Dashboard, Security, Receipt } from "@mui/icons-material";

const Sidebar = ({ setSelectedMenu }) => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, component: "Dashboard" },
    { text: "Security Guards", icon: <Security />, component: "SecurityGuards" },
    { text: "Bookings", icon: <Receipt />, component: "Bookings" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          marginTop: "90px", 
          height: "calc(100vh - 64px)", 
          borderRadius:'30px'
        },
      }}
    >
      {/* Ensures space below header */}
      <Toolbar />

      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            onClick={() => setSelectedMenu(item.component)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
