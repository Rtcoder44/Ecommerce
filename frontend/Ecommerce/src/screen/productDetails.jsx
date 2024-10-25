import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { Box, Button } from '@mui/material';
import { useCart } from '../components/cartContext'; 

export default function ProductDetails() {
    const { id } = useParams(); 
    const [product, setProduct] = useState(null);
    const { dispatch } = useCart(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/${id}`); 
                if (response.ok) {
                    const data = await response.json();
                    setProduct(data);
                } else {
                    console.error("Failed to fetch product details");
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        };
        fetchProductDetails();
    }, [id]);

    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
    };

    const addToCart = (product) => {
        if (isLoggedIn()) {
            dispatch({ type: "ADD_TO_CART", payload: product });
        } else {
            navigate('/login');
        }
    };

    if (!product) {
        return <Typography variant="h6" sx={{ textAlign: 'center' }}>Loading product details...</Typography>;
    }

    return (
        <Box sx={{ padding: '20px' }}>
            <Card sx={{ maxWidth: 600, margin: 'auto', padding: '20px' }}>
                <CardMedia
                    component="img"
                    height="400"
                    image={product.imageUrl}
                    alt={product.productName}
                    sx={{ objectFit: 'contain' }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                        {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {product.productDiscription}
                    </Typography>
                    <Typography variant="h6" sx={{ color: "#388E3C" }}>
                        Price: ₹{product.price}
                    </Typography>
                    <Button 
                        onClick={() => addToCart(product)} 
                        variant="contained" 
                        sx={{ mt: 2, backgroundColor: "#FFB300", color: "#fff", '&:hover': { backgroundColor: '#FFA000' } }}
                    >
                        Add to Cart
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}
