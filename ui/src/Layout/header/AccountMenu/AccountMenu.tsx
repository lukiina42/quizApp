import React from "react";
import { Menu, MenuItem, ListItemIcon, Divider, Avatar } from "@mui/material";
import { Logout } from "@mui/icons-material/";

interface AccountMenuProps {
  anchorOpen: boolean;
  handleOptionsOpen: (element: Element) => void;
  handleClose: () => void;
  anchor: Element | null;
  email: string;
  handleLogout: () => void;
}

export default function AccountMenu(props: AccountMenuProps) {
  const { anchorOpen, handleClose, anchor, email, handleLogout } = props;
  return (
    //ngl I copied this from mui menu demo
    <Menu
      anchorEl={anchor}
      id="account-menu"
      open={anchorOpen}
      onClose={handleClose}
      onClick={handleClose}
      PaperProps={{
        elevation: 0,
        sx: {
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          mt: 1.5,
          "& .MuiAvatar-root": {
            width: 32,
            height: 32,
            ml: -0.5,
            mr: 1,
          },
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: "background.paper",
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem
        onClick={handleClose}
        sx={{ display: "flex", justifyContent: "center", fontWeight: "bold" }}
      >
        {email}
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Avatar /> My account
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
}
