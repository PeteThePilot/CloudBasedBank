import Navbar from './navbar';
import { useState } from 'react';
import bank from '../images/bank.jpg'; 
import { useNavigate } from "react-router-dom";
import {useAuth} from "./AuthProvider.js"
function Login({ url, title,typeofuser }) { 
    const { setUser } = useAuth(); 
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
  
    const handleLogin = async () => {
        try {
          const response = await fetch(url, {
            method: "POST", 
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username,
              password,
            }),
          });
      
          if (!response.ok) {
            console.log(username,password)
            alert('wrong username or password');
          } else {
            const data = await response.json();
            sessionStorage.setItem("token", data);
            setUser({ type: typeofuser });
            switch(typeofuser){
              case "user":
                navigate("/user");
                break;
              case "cashier":
                navigate("/cashier");
                break;
              case "admin":
                navigate("/admin");
                break;

            }
            console.log(data)
          }
        } catch (error) {
          console.log(username,password)
        }
      };
  
    return (
        <div style={{ backgroundColor: '#98c1d9', minHeight: '100vh', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <Navbar />
          <h1 style={{ textAlign: 'center', color: 'white' }}>{title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <img src={bank} alt="Logo" style={{ width: '50%', height: '100%' }} />
            <div style={{ marginLeft: '20px' }}>
              <h2>Username:</h2>
              <input type="text" name="name" onChange={(e) => setUsername(e.target.value)} />
              <h2>Password:</h2>
              <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
              <h2></h2>
              <button type="button" onClick={handleLogin}> Sign In</button>
            </div>
          </div>
        </div>
      );
    }

export default Login;
