import { useEffect, useState } from "react";  // Keep this import only once
import { useCart } from "../components/cartContext";
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

export default function Homepage() {
    const [products, setProducts] = useState([]);
    const { dispatch } = useCart();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Fetch products using fetch API
    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                setMessage("Failed to fetch the data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("Error fetching data");
        }
    };

    // useEffect to fetch products when the component mounts
    useEffect(() => {
        fetchProducts();
    }, []);

    // Check if user is logged in
    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
    };

    // Add product to cart
    const addToCart = (product) => {
        if (isLoggedIn()) {
            dispatch({ type: "ADD_TO_CART", payload: product });
            setMessage(`Added ${product.productName} to cart`);
        } else {
            setMessage("You must be logged in to add products to the cart.");
            navigate('/login');
        }
    };

    return (
        <div className="App" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh', padding: '20px' }}>
            {message && <Typography variant="body1" color="success.main" sx={{ padding: 2, textAlign: 'center' }}>{message}</Typography>}
            <Box sx={{ p: 4 }}>
                {products.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', color: '#555' }}>No products available.</Typography>
                ) : (
                    <Box 
                        sx={{
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 3, 
                            mt: 3, 
                            justifyContent: 'center', 
                            backgroundColor: '#e8f5e9',
                            padding: '20px', 
                            borderRadius: '15px'
                        }}
                    >
                        {products.map((product, index) => (
                            <Card 
                                key={index} 
                                sx={{
                                    width: '300px',
                                    borderRadius: 3,
                                    boxShadow: 3,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                        boxShadow: 6,
                                    },
                                    backgroundColor: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <CardMedia
                                    sx={{ 
                                        height: 180, 
                                        width: '100%', 
                                        objectFit: 'cover', 
                                        backgroundColor: "#e0f7fa"
                                    }} 
                                    image={product.imageUrl}
                                    title={product.productName}
                                />
                                <CardContent sx={{ backgroundColor: "#f9fbe7", flexGrow: 1 }}> 
                                    <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        {product.productName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                                        {product.productDiscription}
                                    </Typography>
                                    <Typography variant="h6" sx={{ mt: 2, textAlign: 'center', color: "#388E3C" }}>
                                        Price: ₹{product.price}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'center', paddingBottom: '16px' }}>
                                    <Link to={`/product/${product._id}`}>
                                        <Button
                                            size="small"
                                            sx={{
                                                backgroundColor: "#FFB300", 
                                                color: "#fff",
                                                transition: 'background-color 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: '#FFA000',
                                                },
                                                padding: '8px 16px',
                                                borderRadius: '20px',
                                            }}
                                        >
                                            View Details
                                        </Button>
                                    </Link>
                                    <Button 
                                        size="small" 
                                        onClick={() => addToCart(product)} 
                                        sx={{
                                            backgroundColor: "#FFB300", 
                                            color: "#fff",
                                            transition: 'background-color 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: '#FFA000',
                                            },
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            ml: 1,
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                )}
            </Box>
        </div>
    );
}
