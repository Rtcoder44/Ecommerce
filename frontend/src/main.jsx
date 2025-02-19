import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CartProvider } from './components/cartContext.jsx';
import { ThemeProvider, createTheme } from '@mui/material/styles';


const theme = createTheme({

});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </CartProvider>
  </StrictMode>
);
