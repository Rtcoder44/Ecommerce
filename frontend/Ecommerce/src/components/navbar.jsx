import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import HomeIcon from '@mui/icons-material/Home';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'; 
import MenuIcon from '@mui/icons-material/Menu';
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 100) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const menuItems = (
    <List>
      <ListItem button component={Link} to="/" onClick={toggleDrawer(false)}>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to="/addProduct" onClick={toggleDrawer(false)}>
        <ListItemText primary="Add Product" />
      </ListItem>
      <ListItem button component={Link} to="/cart" onClick={toggleDrawer(false)}>
        <ListItemText primary="Cart" />
      </ListItem>
    </List>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          mb: 2,
          background: isScrolled ? 'rgba(63, 81, 181, 0.9)' : 'rgba(63, 81, 181, 0.7)',
          boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.2)' : 'none',
          transition: 'background 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', letterSpacing: '1px' }}>
            My E-commerce
          </Typography>

          {isMobile ? (
            <>
              <IconButton onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                {menuItems}
              </Drawer>
            </>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}>
              <Button component={Link} to="/" color="inherit" startIcon={<HomeIcon />} sx={{ mx: 1 }}>
                Home
              </Button>
              <Button component={Link} to="/addProduct" color="inherit" startIcon={<AddShoppingCartIcon />} sx={{ mx: 1 }}>
                Add Product
              </Button>
              <IconButton component={Link} to="/cart" color="inherit" sx={{ mx: 1 }}>
                <ShoppingCartIcon />
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Navbar;
