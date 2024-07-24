import React, { useState } from 'react';
import { TextField, Button, Box, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
//https://localhost:3001/
//https://ec2-54-146-112-128.compute-1.amazonaws.com:3001/whostoken

const AccountAdder = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    initialDeposit: ''
  });
  const checkToken = async (token) => {
    try {
        const response = await fetch("https://localhost:3001/whostoken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
        });

        if (response.ok) {
            const data = await response.json();

            console.log({ username: data.token1.username, typeofuser: data.typeofuser });
            return { username: data.token1.username, typeofuser: data.typeofuser };
        } else {
            throw new Error('Token verification failed');
        }
    } catch (error) {
        throw new Error('Token verification failed');
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const { username, typeofuser } = await checkToken(token);
    try {
      const response = await axios.post('https://localhost:3001/userCreator', {
        username: formData.username,
        password: formData.password,
        initialMoney: formData.initialDeposit,
        typeofuser:typeofuser, 
        nameofuserWhoSubmittedit:username
      });
      console.log(response)

      console.log("here and miss")
      console.log(typeofuser)

      switch(typeofuser){
        case "cashier":
          console.log("insdie here")
            navigate("/cashier");
            break;
        case "admin":
            navigate("/admin");
            break;
      }
    } catch (error) {
      alert("username already created")
      console.error('Error creating user:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            variant="outlined"
          />
          <TextField
            label="Initial Deposit"
            name="initialDeposit"
            type="number"
            value={formData.initialDeposit}
            onChange={handleChange}
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AccountAdder;
