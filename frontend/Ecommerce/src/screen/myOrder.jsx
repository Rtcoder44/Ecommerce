import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("You need to be logged in to view your orders.");
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/orders/product', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error response from server:", errorData);
                    throw new Error(`Failed to fetch orders: ${errorData.error || 'Unknown error'}`);
                }

                const data = await response.json();
                console.log("Fetched orders:", data);

                if (!Array.isArray(data)) {
                    console.error("Orders data is not an array:", data);
                    throw new Error("Orders data is not in the expected format.");
                }

                setOrders(data);
            } catch (err) {
                console.error("Error while fetching orders:", err);
                setError(err.message || "An unknown error occurred.");
            } finally {
                setLoading(false);  
            }
        };

        fetchOrders();
    }, []);

    return (
        <Box sx={{ padding: 3, maxWidth: 800, margin: 'auto' }}>
            <Typography variant="h4" gutterBottom align="center" color="primary">My Orders</Typography>

            {loading ? (
                <Typography variant="body1" align="center">Loading orders...</Typography>
            ) : error ? (
                <Typography variant="body1" align="center" color="error">{error}</Typography>
            ) : orders.length === 0 ? (
                <Typography variant="body1" align="center">You have no orders yet.</Typography>
            ) : (
                <List>
                    {orders.map((order) => (
                        <ListItem key={order._id} sx={{ borderBottom: "1px solid #ccc", mb: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                            <ListItemText
                                primary={<Typography variant="h6">Order Date: {new Date(order.date).toLocaleDateString()}</Typography>}
                                secondary={order.items.map((item, index) => (
                                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <Link to={`/product/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Button variant="text" color="primary">{item.productName}</Button>
                                        </Link>
                                        <Typography variant="body1">
                                            ₹{item.price} x {item.quantity}
                                        </Typography>
                                    </Box>
                                ))}
                            />
                            <Divider />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}
