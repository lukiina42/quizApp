import React from "react";
import { Grid, Button, Box } from "@mui/material";
import { useAnchor } from "../../../common/useAnchor";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountMenu from "./accountMenu/AccountMenu";

interface HomePageHeaderProps {
  userEmail: string;
  handleLogout: () => void;
}

export default function HomePageHeader(props: HomePageHeaderProps) {
  const { userEmail, handleLogout } = props;

  const {
    anchor,
    open: anchorOpen,
    handleClose,
    handleOptionsOpen,
  } = useAnchor();

  const handleLogoutMenu = () => {
    handleLogout();
    handleClose();
  };

  return (
    <>
      <Grid
        container
        direction="row"
        spacing={0}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          height: "3.5rem",
          minHeight: "3.5rem",
          borderBottom: "1px solid #edf4ff",
        }}
      >
        <Grid item sx={{ paddingLeft: 2 }}>
          <div style={{ fontWeight: "bold" }}>{userEmail}</div>
        </Grid>

        <Grid item sx={{ paddingRight: 2 }}>
          <Box
            display={"flex"}
            flexDirection="row"
            alignItems={"center"}
            sx={{ gap: "1rem" }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              //onClick={handlePopoverChange}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Create quiz
            </Button>
            <AccountCircleIcon
              fontSize="large"
              sx={{
                ":hover": {
                  cursor: "pointer",
                },
                color: "#a65419",
              }}
              onClick={handleOptionsOpen}
            />
          </Box>
        </Grid>
      </Grid>
      <AccountMenu
        anchorOpen={anchorOpen}
        anchor={anchor}
        handleClose={handleClose}
        handleOptionsOpen={handleOptionsOpen}
        handleLogout={handleLogoutMenu}
        email={userEmail}
      />
    </>
  );
}
