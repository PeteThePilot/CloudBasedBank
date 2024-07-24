import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, TextField, Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const UserTransferForm = () => {
  const navigate = useNavigate();
  const [senderAccountNumber, setSenderAccountNumber] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState([]);
  const token = sessionStorage.getItem("token");
  const [accountsid, setAccountsid] = useState([]);



  useEffect(() => {
    
    const fetchAccounts = async () => {
      const { username, typeofuser } = await checkToken(token);
      try {
        const response = await axios.post('https://localhost:3001/getaccounts', {username});
        if (response.status === 200) {
          console.log(response.data.accounts)
          setAccounts(response.data.accounts);
          setAccountsid(response.data.accounts.map(account => account._id));
          console.log(accountsid)

        } else {
          setAccounts([]);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error.message);
        setAccounts([]);
      }
    };

    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isNaN(amount) && parseFloat(amount) >= 0 && senderAccountNumber !== receiverAccountNumber) {
      try {
        const { username, typeofuser } = await checkToken(token);
        const transferamount = await checkTodaysTransfer(senderAccountNumber)
        if(parseFloat(transferamount)+parseFloat(amount)>1000){
          alert("tooo much money transfered today try again tommorrow,or go to the bank")
          navigate("/user");
        }
        const response = await axios.post('https://localhost:3001/transfer-money', {
          senderAccountId: senderAccountNumber,
          receiverAccountId: receiverAccountNumber,
          amount: amount,
          user: username,
          type: typeofuser
        });

        if (response.data.success) {
          navigate('/user');
        } else {
          alert("insufficient fund");
        }
      } catch (error) {
        console.error('Error transferring money:', error);
        alert('An error occurred while transferring money. Please try again later.');
      }
    } else {
      alert('Negative amount can\'t be used or no transfers to the same account');
    }
  };
  async function checkTodaysTransfer(account_from) {
    try {
      const response = await axios.post("https://localhost:3001/check-todays-transfer", { account_from });
      return response.data.totalMoneyTransferredToday;
    } catch (error) {
      return(error);
    }
  }
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
        return { username: data.token1.username, typeofuser: data.typeofuser };
      } else {
        throw new Error('Token verification failed');
      }
    } catch (error) {
      throw new Error('Token verification failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FormControl variant="outlined">
          <InputLabel htmlFor="senderAccountNumber">Sender Account Number</InputLabel>
          <Select
  labelId="demo-simple-select-label"
  id="demo-simple-select"
  value={senderAccountNumber}
  label="Sender Account Number"
  onChange={(e) => setSenderAccountNumber(e.target.value)}
>
  {accountsid.map((accountId) => (
    <MenuItem key={accountId} value={accountId}>
      {accountId}
    </MenuItem>
  ))}
</Select>

        </FormControl>
      </div>
      <div>
        <TextField
          required
          id="receiverAccountNumber"
          label="Receiver Account Number"
          variant="outlined"
          value={receiverAccountNumber}
          onChange={(e) => setReceiverAccountNumber(e.target.value)}
        />
      </div>
      <div>
        <TextField
          required
          id="amount"
          label="Amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </form>
  );
};

export default UserTransferForm;
