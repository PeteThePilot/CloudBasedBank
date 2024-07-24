
import Login from "../componets/general_login";
const backendUrl = "https://localhost:3001/adminlogin";


function Admin(){

   return (
    <div className="App">
        <Login url={backendUrl} title="Admin Login" typeofuser="admin"/>
    </div>
);
}
  export default Admin;
