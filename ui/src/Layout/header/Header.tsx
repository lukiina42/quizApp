import React from "react";
import { useLocation, useHistory } from "react-router-dom";
import {
  useUser,
  UserStatus,
  useUserUpdate,
  initialLoggedUserState,
} from "../../context/UserContext";
import HomePageHeader from "./HomePageHeader/HomePageHeader";
import AccountMenu from "./AccountMenu/AccountMenu";
import { useAnchor } from "../../common/useAnchor";

//The header of the application.
//It is displayed differently based on current url location in the app and whether the user is guest or logged in
export default function Header() {
  //The location is saved in this variable, used in useEffect to find out when user changes the page and react to it
  const location = useLocation();
  //History used to move between pages
  const history = useHistory();

  //Current user and change user method from context
  const currentUser = useUser();
  const changeUser = useUserUpdate();

  const {
    anchor,
    open: anchorOpen,
    handleClose,
    handleOptionsOpen,
  } = useAnchor();

  //Logout the user
  const handleLogout = (): void => {
    //@ts-ignore
    changeUser(initialLoggedUserState);
    history.push("/");
  };

  const handleLogoutMenu = () => {
    handleLogout();
    handleClose();
  };

  const getCurrentHeader = () => {
    if (
      location.pathname === "/quiz" &&
      currentUser.status === UserStatus.Logged
    ) {
      //todo
      //return <EditQuizHeader />;
      return <></>;
    }
    if (location.pathname === "/" && currentUser.status === UserStatus.Logged) {
      return <HomePageHeader handleAccountOptionsOpen={handleOptionsOpen} />;
    }
    return <></>;
  };

  return (
    <>
      <header>{getCurrentHeader()}</header>
      <AccountMenu
        anchorOpen={anchorOpen}
        anchor={anchor}
        handleClose={handleClose}
        handleOptionsOpen={handleOptionsOpen}
        handleLogout={handleLogoutMenu}
        email={currentUser.email.split("@")[0]}
      />
    </>
  );
}
