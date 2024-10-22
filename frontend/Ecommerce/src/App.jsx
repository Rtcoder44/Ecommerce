import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/navbar"
import Homepage from "./screen/homepage";
import AddProduct from "./screen/addProduct";
import Cart from "./screen/cart";
import SignUp from './screen/signup';
import Login from './screen/login';
import MyOrders from './screen/myOrder';
import ProductDetails from './screen/productDetails';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/addProduct" element={<AddProduct />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/myorder" element={<MyOrders />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
