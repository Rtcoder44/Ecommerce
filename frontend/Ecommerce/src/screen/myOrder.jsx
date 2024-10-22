import React, { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

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
                const response = await fetch('http://localhost:8080/myorder', {
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
                setLoading(false);  // Stop loading once data is fetched or error occurs
            }
        };

        fetchOrders();
    }, []);

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>My Orders</Typography>

            {loading ? (
                <Typography variant="body1">Loading orders...</Typography>
            ) : error ? (
                <Typography variant="body1" color="error">{error}</Typography>
            ) : orders.length === 0 ? (
                <Typography variant="body1">You have no orders yet.</Typography>
            ) : (
                <List>
                    {orders.map((order) => (
                        <ListItem key={order._id} sx={{ borderBottom: "1px solid #ccc", mb: 2 }}>
                            <ListItemText
                                primary={`Order Date: ${new Date(order.date).toLocaleDateString()}`}
                                secondary={order.items.map((item, index) => (
                                    <Typography key={index} variant="body1">
                                        {item.productName} - ₹{item.price} x {item.quantity}
                                    </Typography>
                                ))}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </Box>
    );
}
