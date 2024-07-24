const express = require("express")
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const model = require('./user_service.js'); 
const dotenv = require('dotenv');
const userModel = require('./user.js'); 
const cashierModel = require('./cashier.js');
const adminModel = require('./admin.js');
const moneyModel = require('./money.js');
const transModel = require('./transactions.js');

const port= 3001 
const fs = require('fs');
var https = require('https');
var http = require('http');

const app = express();
app.use(cors());  
app.use(express.json());
dotenv.config();


function generateUserAccessToken(username) {
    return jwt.sign(username, process.env.User_SECRET, { expiresIn: '1800s' });
  }
  function generateCashierAccessToken(username) {
    return jwt.sign(username, process.env.Cashier_SECRET, { expiresIn: '1800s' });
  }
  function generateAdminAccessToken(username) {
    return jwt.sign(username, process.env.Admin_SECRET, { expiresIn: '1800s' });
  }
app.get('/', (req, res) => {
    console.log('JWT Secret:', jwtSecret);
});

app.post('/login', async(req, res) => {
    const { username, password } = req.body;
    const user = await model.findUserByName(userModel,username);

    if (user.length !== 0) {
        const pass2 = user[0].password;
        console.log("beforeif",pass2,password)

        if (pass2 == password) {
            console.log("if")

            const token = generateUserAccessToken({ username: req.body.username });
            res.json(token);
        } else {

            res.status(401).json({ error: 'Wrong Password' });
        }
    } else {
        res.status(401).json({ error: 'Authentication failed' });
    }
});
app.post('/adminlogin', async(req, res) => {
    const { username, password } = req.body;
    const user = await model.findUserByName(adminModel,username);
    if (user.length !== 0) {
        const pass2 = user[0].password;
        if (pass2 === password) {
            const token = generateAdminAccessToken({ username: req.body.username });
            res.json(token);
        } else {
            res.status(401).json({ error: 'Wrong Password' });
        }
    } else {
        res.status(401).json({ error: 'Authentication failed' });
    }
});
app.post('/cashierlogin', async(req, res) => {
    const { username, password } = req.body;
    const user = await model.findUserByName(cashierModel,username);
    if (user.length !== 0) {
        const pass2 = user[0].password;
        if (pass2 === password) {
            const token = generateCashierAccessToken({ username: req.body.username });
            res.json(token);
        } else {
            res.status(401).json({ error: 'Wrong Password' });
        }
    } else {
        res.status(401).json({ error: 'Authentication failed' });
    }
});

app.post('/getaccounts', async (req, res) => {
    const { username } = req.body; 
    try {
        const accounts = await model.getAccounts(username);
        if (accounts.length > 0) {
            res.status(200).json({accounts: accounts });
        } else {
            res.status(404).json({error: 'No accounts found for the specified username.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});
app.get('/transactions', async (req, res) => {
    const { account_from, account_to } = req.query;
    const filter = {};

    if (account_from) {
        filter.account_from = account_from;
    }

    if (account_to) {
        filter.account_to = account_to;
    }

    try {
        const transactions = await transModel.find(filter);
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/transfer-money', async (req, res) => {
    const { senderAccountId, receiverAccountId, amount,user,type} = req.body;
  
    try {
      const transferResult = await model.transferMoneyWithTransaction(senderAccountId, receiverAccountId, amount,user,type);
      if (transferResult.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    } catch (error) {
      console.error('Error transferring money:', error);
      res.status(500).json({ success: false });
    }
  });
  const check_admin = (token) => {
    try {
        jwt.verify(token, process.env.Admin_SECRET);
        return true;
    } catch (err) {
        return false;
    }
};

const verifyAndDecodeToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return 1;
    } catch (err) {
        return 0;
    }
};
app.post('/whostoken', async (req, res) => {
    const { token } = req.body;
    let test = 0;
    let token1 = "";
    let username = "";

    let type = await verifyAndDecodeToken(token, process.env.User_SECRET);
    if (type === 1) {
        test = 1;
    }

    type = await verifyAndDecodeToken(token, process.env.Cashier_SECRET);
    if (type === 1) {
        test = 2;
    }

    type = await verifyAndDecodeToken(token, process.env.Admin_SECRET);
    if (type === 1) {
        test = 3;
    }

    switch (test) {
        case 0:
            res.status(401).json({ error: 'Invalid Token' });
            break;
        case 1:
            token1 = jwt.verify(token, process.env.User_SECRET);
            username = token1.username;
            res.json({ "typeofuser": "user", token1 });
            break;
        case 2:
            token1 = jwt.verify(token, process.env.Cashier_SECRET);
            username = token1.username;
            res.json({ "typeofuser": "cashier", token1 });
            break;
        case 3:
            token1 = jwt.verify(token, process.env.Admin_SECRET);
            username = token1.username;
            res.json({ "typeofuser": "admin", token1 });
            break;
    }
});

app.delete('/delete-cashier', async (req, res) => {
    const { token, username } = req.body;
    try {
        const isAdmin = check_admin(token);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const result = await model.deleteCashier(username);

        if (result.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Error deleting cashier:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/delete-user-account', async (req, res) => {
    const { token, username } = req.body;
    try {
        const isAdmin = check_admin(token);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }
        const result = await model.deleteUserAccount(username);
        console.log(result);

        if (result.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/addmoneyentry', async (req, res) => {
    const { username, initialMoney } = req.body;
    try {
        const result = await model.addMoneyEntry(username, initialMoney);
        console.log(result);
        if (result.success) {
            res.status(200).json({ success: true });
        } else {
            res.status(200).json({ success: false });
        }
    } catch (error) {
        console.error('Error adding money entry:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
app.post('/check-account-balance', async (req, res) => {
    const { accountId } = req.body;

    try {
        const account = await moneyModel.findOne({ _id: accountId });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json({ balance: account.money });
    } catch (error) {
        console.error('Error checking account balance:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/deposit-money', async (req, res) => {
    const { accountId, amount, user, type, nameofuserWhoSubmittedit } = req.body;

    if (!nameofuserWhoSubmittedit) {
        return res.status(400).json({ error: 'nameofuserWhoSubmittedit is required' });
    }

    try {
        const account = await moneyModel.findOne({ _id: accountId });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        const depositAmountToday = await model.checkTodaysDeposit(accountId);
        let depositLimit;

        switch (type) {
            case "cashier":
                depositLimit = 10000;
                break;
            case "admin":
                depositLimit = 100000;
                break;
            default:
                depositLimit = 0;
                break;
        }

        if (parseFloat(depositAmountToday.totalMoneyDepositedToday) + parseFloat(amount) > depositLimit) {
            return res.status(400).json({ error: `Deposit limit exceeded. You can deposit up to ${depositLimit - depositAmountToday.totalMoneyDepositedToday} more today.` });
        }

        account.money += parseFloat(amount);
        await account.save();

        await model.makeDeposit(user, accountId, type, nameofuserWhoSubmittedit);

        res.status(200).json({ success: true, newBalance: account.money });
    } catch (error) {
        console.error('Error making deposit:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});



app.post('/check-todays-transfer', async (req, res) => {
    const { account_from } = req.body;
    if (!account_from) {
      return res.status(400).json({ error: 'Missing account_from field in request body' });
    }
    try {
      const result = await model.checkTodaysTransfer(account_from);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  app.post('/userCreator', async (req, res) => {
    const { username, password, initialMoney,typeofuser,nameofuserWhoSubmittedit } = req.body;
    try {
        const newUser = await model.addUser(userModel, username, password);
        if (newUser) {
            console.log("money")
            const moneyEntryResult = await model.addMoneyEntryForDeposit(username, initialMoney);
            console.log("money2")

            if (moneyEntryResult) {
                console.log("before")
                console.log(moneyEntryResult)
                const { _id: accountnum } = moneyEntryResult._id; 
                console.log("id: ",accountnum)
                const deposit = await model.makeDeposit(username, accountnum, typeofuser, nameofuserWhoSubmittedit);
                if (deposit) {
                    res.status(201).json(newUser);
                } else {
                    res.status(400).send('Failed to make deposit');
                }
            } else {
                res.status(400).send('Failed to create user or add money entry');
            }
        } else {
            res.status(400).send('Failed to create user');
        }
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});
app.post('/check-todays-deposit', async (req, res) => {
    const { account_from } = req.body;
    if (!account_from) {
        return res.status(400).json({ error: 'Missing account_from field in request body' });
    }
    try {
        const result = await model.checkTodaysDeposit(account_from);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/create-cashier', async (req, res) => {
    const { username, password, nameofuserWhoSubmittedit } = req.body;

    try {
        const newCashier = await model.addUser(cashierModel, username, password);
        if (newCashier) {
            res.status(201).json(newCashier);
        } else {
            res.status(400).send('Failed to create cashier');
        }
    } catch (error) {
        console.error('Error creating cashier:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/test', (req, res) => {
    res.status(200).send('This is a test endpoint');
});
  
 const options = {
     key: fs.readFileSync('/home/vagrant/backend/cert/key.pem'),
     cert: fs.readFileSync('/home/vagrant/backend/cert/cert.pem')
   };
  
   const server = https.createServer(options, (req, res) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'text/plain');
     res.end('Hello, World!\n');
   });
  server.listen(port, () => {
    console.log(`Server running at https://ec2-54-146-112-128.compute-1.amazonaws.com:3001:${port}/`);
  });