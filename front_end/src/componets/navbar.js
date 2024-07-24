import { AppBar, Toolbar, Typography, Button, styled } from '@mui/material';
import logo from '../images/fishing.png'; 
import { Link } from 'react-router-dom'; 

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    justifyContent: 'space-between',
  });
const Navbar = () => {
    return (
      <AppBar position="static">
        <StyledToolbar>
        <Link to="/">
        <img src={logo} alt="Logo" style={{ width: '50px', height: '50px', marginRight: '10px' }} /> 
        </Link>
          <Typography  style={{textAlign:'center', variant:"h6"}}>Fishing Bank</Typography>
          <div>
            <Button color="inherit" component={Link} to="/user_login">User Login</Button>
            <Button color="inherit" component={Link} to="/admin_login">Admin Login</Button>
            <Button color="inherit" component={Link} to="/cashier_login">Cashier Login</Button>
          </div>
        </StyledToolbar>
      </AppBar>
    );
  };
  export default Navbar;