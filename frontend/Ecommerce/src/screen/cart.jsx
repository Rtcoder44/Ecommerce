import React from 'react';
import { Button, Typography, List, ListItem, ListItemText, Box, Card, CardMedia, CardContent } from '@mui/material';
import { Link } from 'react-router-dom'; 
import { useCart } from '../components/cartContext';

export default function Cart() {
    const { state, dispatch, clearCart, removeFromCart } = useCart();
    const { cart } = state;

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + item.quantity * item.price, 0);
    };

    const increaseQuantity = (index) => {
        dispatch({ type: "INCREASE_QUANTITY", payload: index });
    };

    const decreaseQuantity = (index) => {
        dispatch({ type: "DECREASE_QUANTITY", payload: index });
    };

    const handleClearCart = () => {
        clearCart();
    };

    const handleCheckOut = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You need to be logged in to place an order.");
                return;
            }

            const response = await fetch('http://localhost:8080/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ cartItems: cart }),
            });

            if (response.ok) {
                await handleClearCart();
                alert("Checkout successful! Your order has been placed.");
            } else {
                const errorData = await response.json();
                alert(`Checkout failed: ${errorData.error || "An unexpected error occurred."}`);
            }
        } catch (error) {
            alert("An error occurred during checkout.");
        }
    };

    return (
        <Box className="cart" sx={{ padding: 2, maxWidth: 600, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom>Your Cart</Typography>

            {cart.length === 0 ? (
                <Typography variant="body1">No items in the cart.</Typography>
            ) : (
                <List>
                    {cart.map((item, index) => (
                        <ListItem key={item._id} sx={{ mb: 2 }}>
                            <Card sx={{ display: 'flex', width: '100%' }}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100, height: 100 }}
                                    image={item.imageUrl} 
                                    alt={item.productName}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <ListItemText
                                        primary={
                                            <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {item.productName}
                                            </Link>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="body1">{item.productDescription}</Typography>
                                                <Typography variant="body1">Price: ₹{item.price}</Typography>
                                                <Typography variant="body1">Quantity: {item.quantity}</Typography>
                                                <Typography variant="body1">Total: ₹{item.quantity * item.price}</Typography>
                                            </>
                                        }
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => increaseQuantity(index)}
                                            sx={{ flex: 1, mr: 1 }}
                                        >
                                            +
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => decreaseQuantity(index)}
                                            sx={{ flex: 1, mr: 1 }}
                                            disabled={item.quantity === 1}
                                        >
                                            -
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => removeFromCart(index)}
                                            sx={{ flex: 1 }}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
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
                        <Button variant="contained" color="secondary" onClick={handleClearCart}>Clear Cart</Button>
                        <Button variant="contained" color="primary" onClick={handleCheckOut}>Checkout</Button>
                    </Box>
                </>
            )}
        </Box>
    );
}
