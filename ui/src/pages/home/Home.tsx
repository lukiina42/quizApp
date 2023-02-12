import { useUser, UserStatus } from "../../context/UserContext";
import { UserInterface } from "../../common/types";
import LoggedUserHome from "./loggedUser/LoggedUserHome";
import GuestHome from "./guest/GuestHome";

export interface AnchorType {
  element: Element | null;
  id: number;
}

//Home component, decides whether guest home or home for logged in user should be displayed and holds states
const Home = () => {
  //Current user from context
  const currentUser: UserInterface = useUser();

  return (
    <>
      {currentUser.status === UserStatus.Logged ? (
        <LoggedUserHome currentUser={currentUser} />
      ) : (
        <GuestHome />
      )}
    </>
  );
};

export default Home;
