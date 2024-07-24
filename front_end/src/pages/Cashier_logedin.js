import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cashier_Logedin() {
    const navigate = useNavigate();
    const [accountNumberCheck, setAccountNumberCheck] = useState('');
    const [balance, setBalance] = useState(null);
    const [accountNumberDeposit, setAccountNumberDeposit] = useState('');
    const [amountDeposit, setAmountDeposit] = useState('');

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/');
    };

    const handleTransfer = () => {
        navigate("/banktransaction");
    };

    const handleAddAccount = () => {
        navigate("/accountmaker");
    };

    const handleAccountNumberCheckChange = (event) => {
        setAccountNumberCheck(event.target.value);
    };

    const handleSubmitCheck = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post('https://localhost:3001/check-account-balance', {
                accountId: accountNumberCheck,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                setBalance(response.data.balance);
            } else {
                alert('Account not found');
            }
        } catch (error) {
            console.error('Error checking account balance:', error);
            alert('An error occurred while checking the account balance. Please try again later.');
        }
    };

    const handleAccountNumberDepositChange = (event) => {
        setAccountNumberDeposit(event.target.value);
    };

    const handleAmountDepositChange = (event) => {
        setAmountDeposit(event.target.value);
    };

    const handleSubmitDeposit = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const { username, typeofuser } = await checkToken(token);
            const depositAmountToday = await checkTodaysDeposit(accountNumberDeposit);

            if (parseFloat(depositAmountToday) + parseFloat(amountDeposit) > 10000) {
                alert("Too much money deposited today, try again tomorrow");
                navigate("/cashier");
                return; // Stop further execution
            }

            const response = await axios.post('https://localhost:3001/deposit-money', {
                accountId: accountNumberDeposit,
                amount: amountDeposit,
                user: username,
                type: typeofuser,
                nameofuserWhoSubmittedit: username
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert(`Deposit successful! New balance: ${response.data.newBalance}`);
                setAccountNumberDeposit('');
                setAmountDeposit('');
            } else {
                alert('Deposit failed');
            }
        } catch (error) {
            console.error('Error making deposit:', error);
            alert('An error occurred while making the deposit. Please try again later.');
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
                console.log({ username: data.token1.username, typeofuser: data.typeofuser });
                return { username: data.token1.username, typeofuser: data.typeofuser };
            } else {
                throw new Error('Token verification failed');
            }
        } catch (error) {
            throw new Error('Token verification failed');
        }
    };

    const checkTodaysDeposit = async (account_from) => {
        try {
            const response = await axios.post("https://localhost:3001/check-todays-deposit", { account_from });
            return response.data.totalMoneyDepositedToday;
        } catch (error) {
            console.error('Error checking today\'s deposit:', error);
            return 0;
        }
    };

    return (
        <div style={{ backgroundColor: '#98c1d9', minHeight: '100vh', padding: '20px' }}>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={handleTransfer}>Transfer</Button>
            <Button onClick={handleAddAccount}>Add Account</Button>

            <div>
                <TextField
                    label="Account Number"
                    variant="outlined"
                    value={accountNumberCheck}
                    onChange={handleAccountNumberCheckChange}
                    style={{ marginTop: '20px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitCheck}
                    style={{ marginTop: '20px' }}
                >
                    Check Balance
                </Button>
                {balance !== null && (
                    <Typography variant="h6" style={{ marginTop: '20px' }}>
                        Balance: {balance}
                    </Typography>
                )}
            </div>

            <div>
                <TextField
                    label="Account Number"
                    variant="outlined"
                    value={accountNumberDeposit}
                    onChange={handleAccountNumberDepositChange}
                    style={{ marginTop: '20px' }}
                />
                <TextField
                    label="Amount"
                    variant="outlined"
                    value={amountDeposit}
                    onChange={handleAmountDepositChange}
                    style={{ marginTop: '20px' }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmitDeposit}
                    style={{ marginTop: '20px' }}
                >
                    Deposit
                </Button>
            </div>
        </div>
    );
}

export default Cashier_Logedin;
