import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCashier() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [adminUsername, setAdminUsername] = useState('');

    useEffect(() => {
        const fetchAdminUsername = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const response = await axios.post('https://localhost:3001/whostoken', { token }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    setAdminUsername(response.data.token1.username);
                } else {
                    alert('Failed to fetch admin username');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error fetching admin username:', error);
                alert('An error occurred while fetching the admin username. Please try again later.');
            }
        };

        fetchAdminUsername();
    }, [navigate]);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post('https://localhost:3001/create-cashier', {
                username,
                password,
                nameofuserWhoSubmittedit: adminUsername,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 201) {
                alert('Cashier added successfully');
                navigate('/admin');
            } else {
                alert('Failed to add cashier');
            }
        } catch (error) {
            console.error('Error adding cashier:', error);
            alert('An error occurred while adding the cashier. Please try again later.');
        }
    };

    return (
        <div style={{ backgroundColor: '#98c1d9', minHeight: '100vh', padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Add Cashier
            </Typography>
            <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={handleUsernameChange}
                style={{ marginTop: '20px' }}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
                style={{ marginTop: '20px' }}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                style={{ marginTop: '20px' }}
            >
                Add Cashier
            </Button>
        </div>
    );
}

export default AddCashier;
