import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem('token');
            if (!token) return alert("You need to be logged in to view your orders.");

            const response = await fetch('http://localhost:8080/myorder', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>My Orders</Typography>

            {orders.length === 0 ? (
                <Typography variant="body1">You have no orders yet.</Typography>
            ) : (
                <List>
                    {orders.map((order) => (
                        <ListItem key={order._id} sx={{ borderBottom: "1px solid #ccc", mb: 2 }}>
                            <ListItemText
                                primary={`Order Date: ${new Date(order.date).toLocaleDateString()}`}
                                secondary={
                                    <>
                                        {order.items.map((item, index) => (
                                            <Typography key={index} variant="body1">
                                                {item.productName} - ₹{item.price} x {item.quantity}
                                            </Typography>
                                        ))}
                                    </>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}
