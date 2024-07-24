import React, { useState, useEffect } from 'react';
import { TextField, Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from '@mui/material';
import TransferForm from "../componets/transaction";

function User_Logedin({ title }) {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [username1, setUsername1] = useState("");

    const fetchAccounts = async (username) => {
        try {
            const response = await axios.post('https://localhost:3001/getaccounts', { username });
            console.log(response)

            if (response.status === 200) {
                setAccounts(response.data.accounts);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching accounts:', error.message);
            return [];
        }
    };

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
                setUsername1(data.token1.username)
                return data.token1.username;
            } else {
                throw new Error('Token verification failed');
            }
        } catch (error) {
            throw new Error('Token verification failed');
        }
    };

    const fetchAccountDetails = async () => {
        try {
            const token = sessionStorage.getItem("token");
            if (!token) {
                throw new Error('Token not found');
            }
            const username = await checkToken(token);
            const fetchedAccounts = await fetchAccounts(username);
            console.log("here")
        } catch (error) {
            console.error('Error fetching account details:', error.message);
        }
    };

    useEffect(() => {
        fetchAccountDetails();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("token");
        navigate("/");
    };

    const handleTransfer = () => {
        navigate("/usertransaction");
    };

    const handleAddAccount = async () => {
        console.log(username1);
        try {
            const response = await axios.post('https://localhost:3001/addmoneyentry', { username: username1, initialMoney: 0 });

            if (response.data.success) {
                fetchAccountDetails();
            } else {
                console.log('Failed to add account:', response.data.message);
            }
        } catch (error) {
            console.error('Error adding account:', error.message);
        }
    };

    return (
        <div style={{ backgroundColor: '#98c1d9', minHeight: '100vh', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button onClick={handleLogout}>Logout</Button>
                <h1>{title}</h1>
                <Button onClick={handleTransfer}>Transfer</Button>
                <Button onClick={handleAddAccount}>Add Account</Button>
            </div>
            <h1 style={{ textAlign: 'center' }}>{title}</h1>
            <Grid container spacing={2}>
                {accounts.map(account => (
                    <Grid key={account._id} item xs={12}>
                        <TextField
                            label="Account Number"
                            variant="outlined"
                            fullWidth
                            value={account._id}
                            disabled
                        />
                        <TextField
                            label="Balance"
                            variant="outlined"
                            fullWidth
                            value={`$${account.money}`}
                            disabled
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default User_Logedin;
