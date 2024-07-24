import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from "./componets/AuthProvider"; 

import Home from './pages/Home';
import Admin from './pages/Admin';
import Cashier from './pages/Cashier';
import User from './pages/User';
import User_Logedin from './pages/User_logedin';
import Cashier_Logedin from './pages/Cashier_logedin';
import Admin_Logedin from './pages/Admin_logedin';
import TransferForm from "./componets/transaction"
import UserTransferForm from "./componets/user_transactions"
import AccountAdder from "./componets/addaccount"
import AddCashier from './componets/addcashier';

const App = () => {
  const { user } = useAuth(); 

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user_login" element={<User />} />
      <Route path="/cashier_login" element={<Cashier />} />
      <Route path="/admin_login" element={<Admin />} />
      {user && user.type === 'user' && (
        <Route path="/user" element={<User_Logedin />} />
      )}
      {user && user.type === 'user' && (
  <Route path="/usertransaction" element={<UserTransferForm />} />
)}

      {user && user.type === 'cashier' && (
        <Route path="/cashier" element={<Cashier_Logedin />} />
      )}
            {user && (user.type === 'cashier' || user.type === 'admin')  &&(
        <Route path="/banktransaction" element={<TransferForm />} />
      )}
                  {user && (user.type === 'cashier' || user.type === 'admin')  &&(
        <Route path="/accountmaker" element={<AccountAdder />} />
      )}
      {user && user.type === 'admin' && (
        <Route path="/admin" element={<Admin_Logedin />} />
      )}
            {user && user.type === 'admin' && (
        <Route path="/addcashier" element={<AddCashier />} />
      )}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
