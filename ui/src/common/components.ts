//defines the endpoint on the server, where the client can initiate the web socket connection
const SOCKET_URL = process.env.REACT_APP_FETCH_HOST + "/betterKahoot/ws-session";
export default SOCKET_URL;
