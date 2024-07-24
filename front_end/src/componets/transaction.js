import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TransferForm = () => {
  const [senderAccountNumber, setSenderAccountNumber] = useState('');
  const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isNaN(amount) && parseFloat(amount) >= 0 && senderAccountNumber !== receiverAccountNumber) {
      try {
        const token = sessionStorage.getItem("token");
        const { username, typeofuser } = await checkToken(token);
        const transferAmountToday = await checkTodaysTransfer(senderAccountNumber);

        switch (typeofuser) {
          case "cashier":
            if (parseFloat(transferAmountToday) + parseFloat(amount) > 10000) {
              alert("Too much money transferred today, try again tomorrow");
              navigate("/cashier");
              return; 
            }
            break;
          case "admin":
            if (parseFloat(transferAmountToday) + parseFloat(amount) > 100000) {
              alert("Too much money transferred today, try again tomorrow");
              navigate("/admin");
              return; 
            }
            break;
          default:
            break;
        }

        console.log(username, typeofuser);

        const response = await axios.post('https://ec2-54-146-112-128.compute-1.amazonaws.com:3001/transfer-money', {
          senderAccountId: senderAccountNumber,
          receiverAccountId: receiverAccountNumber,
          amount: amount,
          user: username,
          type: typeofuser
        });

        if (response.data.success) {
          switch (typeofuser) {
            case "cashier":
              navigate("/cashier");
              break;
            case "admin":
              navigate("/admin");
              break;
            default:
              break;
          }
        } else {
          alert("Insufficient funds");
        }
      } catch (error) {
        console.error('Error transferring money:', error);
        alert('An error occurred while transferring money. Please try again later.');
      }
    } else {
      alert('Negative amount can\'t be used or no transfers to the same account');
    }
  };

  const checkToken = async (token) => {
    try {
      const response = await fetch("https://ec2-54-146-112-128.compute-1.amazonaws.com:3001/whostoken", {
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

  const checkTodaysTransfer = async (account_from) => {
    try {
      const response = await axios.post("https://ec2-54-146-112-128.compute-1.amazonaws.com:3001/check-todays-transfer", { account_from });
      return response.data.totalMoneyTransferredToday;
    } catch (error) {
      console.error('Error checking today\'s transfer:', error);
      return 0;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <TextField
          required
          id="senderAccountNumber"
          label="Sender Account Number"
          variant="outlined"
          value={senderAccountNumber}
          onChange={(e) => setSenderAccountNumber(e.target.value)}
        />
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

export default TransferForm;
