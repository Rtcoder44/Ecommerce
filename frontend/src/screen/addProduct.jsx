import { useState } from "react";
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    TextareaAutosize,
    Paper
} from '@mui/material';

export default function AddProduct() {
    const [product, setProduct] = useState({
        productName: '',
        productDiscription: '',
        price: '',         
        imageUrl: '',
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');  

            const response = await fetch('http://localhost:8080/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,  
                },
                body: JSON.stringify(product),
            });

            if (response.ok) {
                setMessage('Product added successfully!');
                setProduct({ productName: '', productDiscription: '', price: '', imageUrl: '' });
            } else {
                const errorData = await response.json();
                setMessage(`Failed to add product: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error submitting product.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Add a New Product
                </Typography>

                {message && (
                    <Alert severity={message.includes('successfully') ? 'success' : 'error'} sx={{ mb: 2 }}>
                        {message}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Product Name"
                            name="productName"
                            value={product.productName}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Box mb={2}>
                        <TextareaAutosize
                            minRows={4}
                            placeholder="Product Description"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                borderColor: '#ccc'
                            }}
                            name="productDiscription"
                            value={product.productDiscription}
                            onChange={handleChange}
                        />
                    </Box>

                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Product Price"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Box mb={2}>
                        <TextField
                            fullWidth
                            label="Image URL"
                            name="imageUrl"
                            value={product.imageUrl}
                            onChange={handleChange}
                            required
                        />
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                    >
                        Add Product
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
