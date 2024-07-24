import React from 'react';

import family from '../images/family.jpg'; 
import Navbar from '../componets/navbar';


function Home() {
  return (
    <div style={{ backgroundColor: '#98c1d9', minHeight: '100vh', padding: '20px' }}> 
      <Navbar></Navbar>
      <h1 style={{ textAlign: 'center',color:'white'}}>Welcome to the fishing family!</h1>
      <img src={family} alt="Logo" style={{ width: '100%', height: '20%', marginRight: '20%' }} /> 
    </div>
  );
}

export default Home;
