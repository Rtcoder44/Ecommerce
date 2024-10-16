import React from "react";
import { useCart } from "./cartContext";
import { Button, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import Navbar from "./components/navbar";

export default function Cart() {
    const { state, dispatch } = useCart();
    const { cart } = state;

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const removeFromCart = (index) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: index });
    };

    const increaseQuantity = (index) => {
        dispatch({ type: "INCREASE_QUANTITY", payload: index });
    };

    const decreaseQuantity = (index) => {
        dispatch({ type: "DECREASE_QUANTITY", payload: index });
    };

    const clearCart = () => {
        dispatch({ type: "CLEAR_CART" });
    };

    const handleCheckOut = async () => {
        try {
            const response = await fetch('http://localhost:8080/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cartItems: cart }),
            });

            if (response.ok) {
                clearCart();
                alert("Checkout successful! Your order has been placed.");
            } else {
                alert("Checkout failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            alert("An error occurred during checkout.");
        }
    };

    return (
        <div>
           
            <Box className="cart" sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>Your Cart</Typography>

                {cart.length === 0 ? (
                    <Typography variant="body1">No items in the cart.</Typography>
                ) : (
                    <List>
                        {cart.map((item, index) => (
                            <ListItem key={index} sx={{ borderBottom: '1px solid #ccc', mb: 2 }}>
                                <ListItemText
                                    primary={item.productName}
                                    secondary={
                                        <>
                                            <Typography variant="body1">{item.productDiscription}</Typography>
                                            <Typography variant="body1">Price: ₹{item.price}</Typography>
                                            <Typography variant="body1">Quantity: {item.quantity}</Typography>
                                            <Typography variant="body1">Total: ₹{item.quantity * item.price}</Typography>
                                        </>
                                    }
                                />
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => increaseQuantity(index)}
                                        sx={{ ml: 2 }}
                                    >
                                        +
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => decreaseQuantity(index)}
                                        sx={{ ml: 2 }}
                                        disabled={item.quantity === 1}
                                    >
                                        -
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={() => removeFromCart(index)}
                                        sx={{ ml: 2 }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                )}

                {cart.length > 0 && (
                    <>
                        <Typography variant="h5" sx={{ mt: 2 }}>
                            Total Price: ₹{calculateTotalPrice()}
                        </Typography>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={clearCart}
                                sx={{ mr: 2 }}
                            >
                                Clear Cart
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleCheckOut}
                            >
                                CheckOut
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </div>
    );
}
