const userModel = require('./user.js'); 
const cashierModel = require('./cashier.js');
const adminModel = require('./admin.js');
const moneyModel = require('./money.js');
const mongoose = require('mongoose');
const transModel = require('./transactions.js');
const depositModel = require("./deposit.js");

mongoose
  .connect(process.env.Connect_String, {
    useNewUrlParser: true,
  })
  .catch((error) => console.log(error));


async function addUser(model,username, password) {
  try {
    const existingUser = await model.findOne({ username });

    if (existingUser) {
      throw new Error('Username already exists');
    }
    const userToAdd = new model({ username, password });
    const savedUser = await userToAdd.save();
    return savedUser;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function deleteUser(model, name) {
    try {
        const result = await model.deleteOne({ username: name });
    } catch (error) {
      console.log(error);
      return false;
    }
  }

async function findUserByName(model,name) {
  return await model.find({ username: name });
}

async function findUserByPassword(model,pass) {
  return await model.find({ password: pass });
}

async function getAllUsers() {
  try {
    const users = await userModel.find({}, '_id username');
    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
async function getAccounts(username1) {
  try {
      const carsonInstances = await moneyModel.find({ username: username1 });
      const formattedInstances = carsonInstances.map(instance => {
          return {
              _id: instance._id,
              money: instance.money
          };
      });
      return formattedInstances;
  } catch (error) {
      throw error;
  }
}
async function createTransaction(account_from, account_to, money) {
  try {
      await Money.findOneAndUpdate(
          { _id: account_from },
          { $inc: { money: -money } }
      );

      await Money.findOneAndUpdate(
          { _id: account_to },
          { $inc: { money } }
      );

      return 'Transaction successful';
  } catch (error) {
    throw error;
  }
}


async function transferMoneyWithTransaction(senderAccountId, receiverAccountId, amount,user,type) {
  try {
      const senderAccount = await moneyModel.findOne({ _id: senderAccountId });
      const receiverAccount = await moneyModel.findOne({ _id: receiverAccountId });

      console.log('Sender Account:', senderAccount);
      console.log('Receiver Account:', receiverAccount);
      console.log("amount", typeof(amount));
      amount = parseFloat(amount);
      if (senderAccount.money >= amount) {
          const session = await moneyModel.startSession();
          session.startTransaction();
          try {
              senderAccount.money -= amount;
              await senderAccount.save();

              console.log("amount", amount);
              let temp =receiverAccount.money + amount;
              console.log(temp);
              receiverAccount.money = temp;
              console.log(receiverAccount.money);
              await receiverAccount.save();

              console.log('Sender Account after deduction:', senderAccount);
              console.log('Receiver Account after increment:', receiverAccount);
              await transModel.create({
                  account_from: senderAccountId,
                  account_to: receiverAccountId,
                  money: amount,
                  username: user,
                  typeofuser: type
              });

              await session.commitTransaction();
              session.endSession();

              return { success: true };
          } catch (error) {
              await session.abortTransaction();
              session.endSession();
              throw error;
          }
      } else {
          return { success: false, message: 'Insufficient funds' };
      }
  } catch (error) {
      throw error;
  }
}


async function addMoneyEntry(user, initialMoney) {
  try {
    console.log(user)
    const banktoAdd = new moneyModel({ username: user, money: initialMoney });
    console.log("banktoAdd:",banktoAdd)

    const savedAccount = await banktoAdd.save();
    console.log("saved account:",savedAccount)
    return{ success: true};
  } catch (error) {
     console.log(error)
      return { success: false};
  }
}
async function addMoneyEntryForDeposit(user, initialMoney) {
  try {
    console.log(user)
    const banktoAdd = new moneyModel({ username: user, money: initialMoney });
    console.log("banktoAdd:",banktoAdd)

    const savedAccount = await banktoAdd.save();
    console.log("saved account:",savedAccount)
    return savedAccount;
  } catch (error) {
     console.log(error)
      return { success: false};
  }
}

async function checkTodaysTransfer(account_from) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const query = {
    account_from: account_from,
    date: {
      $gte: date,
      $lte: endOfDay
    }
  };
  try {
    const transactions = await transModel.find(query); 
    const totalMoneyTransferredToday = transactions.reduce((total, transaction) => {
      return total + transaction.money;
    }, 0);

    return {
      transactions: transactions,
      totalMoneyTransferredToday: totalMoneyTransferredToday
    };
  } catch (err) {
    return {
      error: err
    };
  }
}
async function makeDeposit(username, accountnum, typeofuser, nameofuserWhoSubmittedit) {
  try {
    console.log("stuckk?")
      const newDeposit = new depositModel({
          username: username,
          accountnum: accountnum,
          typeofuser: typeofuser,
          nameofuserWhoSubmittedit: nameofuserWhoSubmittedit
      });
      console.log("stuckk2?")

      const savedDeposit = await newDeposit.save();
      console.log(savedDeposit)

      return savedDeposit;
  } catch (error) {
      console.error('Error making deposit:', error);
      throw error;
  }
}
async function checkTodaysDeposit(account_from) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  const query = {
      account_from: account_from,
      date: {
          $gte: date,
          $lte: endOfDay
      }
  };
  try {
      const deposits = await depositModel.find(query); 
      const totalMoneyDepositedToday = deposits.reduce((total, deposit) => {
          return total + deposit.amount;
      }, 0);

      return {
          deposits: deposits,
          totalMoneyDepositedToday: totalMoneyDepositedToday
      };
  } catch (err) {
      return {
          error: err
      };
  }
}
async function deleteCashier(username) {
  try {
    await cashierModel.deleteOne({ username: username });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

async function deleteUserAccount(username) {
  try {
    await userModel.deleteOne({ username: username });
    await moneyModel.deleteMany({ username: username }); 
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};






module.exports = {
    addUser,
    findUserByName,
    findUserByPassword,
    deleteUser,getAllUsers,getAccounts,createTransaction,transferMoneyWithTransaction,addMoneyEntry,checkTodaysTransfer,makeDeposit,addMoneyEntryForDeposit,checkTodaysDeposit,deleteCashier,deleteUserAccount
    
};
