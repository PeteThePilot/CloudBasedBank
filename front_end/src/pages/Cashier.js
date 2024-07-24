import Login from "../componets/general_login";
const backendUrl = "https://localhost:3001/cashierlogin";

function Cashier(){
   return (
    <div className="App">
        <Login url={backendUrl} title="Cashier Login" typeofuser="cashier" />
    </div>
);
}
  export default Cashier;
