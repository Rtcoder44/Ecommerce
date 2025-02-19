import React, { useState } from 'react';
import { TextField, Button, Grid, Container, Typography, Box } from '@mui/material';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const SignUp = ()=>{
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await fetch(`${API_BASE_URL}/signup`,{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setMessage('Account created Successfully!');
            setFormData({ fullName: '', email: '', password: '' });
        } else {
            setMessage('Failed to create an account');
        }
       
    };


    return(
        <Container maxWidth="sm">
        <Box sx={{ mt: 5 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Signup
            </Typography>
            {message && (
                    <Typography
                        variant="body1"
                        color={message.includes("successfully") ? "green" : "success"}
                        gutterBottom
                    >
                        {message}
                    </Typography>
                )}
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            label="Full Name"
                            variant="outlined"
                            fullWidth
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            variant="outlined"
                            fullWidth
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Signup
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    </Container>
    )
}

export default SignUp;