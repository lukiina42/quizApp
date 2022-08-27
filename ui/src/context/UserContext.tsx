import React, { useContext, createContext, useState } from "react";
import { UserInterface } from "../common/types";

//Possible statuses of the user, either logged or not logged (nobody is logged in the app - display pages for guest)
export const UserStatus = {
  Logged: "Logged",
  NotLogged: "NotLogged",
};

//The user state for guest
export const initialLoggedUserState: UserInterface = {
  id: 0,
  email: "",
  status: UserStatus.NotLogged,
};

//Create contexts for holding current user and for update of the user
const UserContext = createContext<UserInterface>(initialLoggedUserState);
const UserContextUpdate = createContext({});

//returns current user
export function useUser() {
  return useContext(UserContext);
}

//returns function, with which can be changed current user
export function useUserUpdate() {
  return useContext(UserContextUpdate);
}

//The component to hold current user globally in the app. That means, that it is accessible from any component in the tree.
//The current user is used pretty much on all of the pages, so it makes sense to have a global context rather than do
//prop drilling through the whole component tree
export const UserProvider = ({ children }) => {
  //State to hold the user
  const [currentUser, setCurrentUser] = useState<UserInterface>(
    initialLoggedUserState
  );

  //The method passed into useUserUpdate
  function changeUser(newUser: UserInterface) {
    setCurrentUser(newUser);
  }

  return (
    <UserContext.Provider value={currentUser}>
      <UserContextUpdate.Provider value={changeUser}>
        {children}
      </UserContextUpdate.Provider>
    </UserContext.Provider>
  );
};
