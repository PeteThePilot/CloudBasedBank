
import Login from "../componets/general_login";
const backendUrl = "https://localhost:3001/login";


function User(){

   return (
    <div className="App">
        <Login url={backendUrl} title="User Login" typeofuser="user" />
    </div>
);
}
  export default User;
