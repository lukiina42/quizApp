import Header from "../Layout/header/Header";
import { UserProvider } from "../context/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import Routes from "../routes/Routes";

const queryClient = new QueryClient();

//The context is defined here, it is wrapped around all of the used components to be available everywhere.
// Also the routing is defined here
function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Header />
          <Routes />
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
