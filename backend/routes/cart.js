const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../model/cart'); 


router.get('/cart', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }); 
     
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
    
        res.json(cart); 
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});


router.put('/update', auth, async (req, res) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { userId: req.user._id },
            { items: req.body.items }, 
            { new: true, upsert: true } 
        );
       
        res.json(updatedCart); 
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ message: 'Error updating cart' });
    }
});


router.delete('/remove', auth, async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ userId: req.user._id }); 
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json({ message: 'Cart cleared' }); 
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).json({ message: 'Error clearing cart' });
    }
});


router.delete('/item/:id', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
    
        cart.items = cart.items.filter(item => item._id.toString() !== req.params.id);
        await cart.save(); 
        res.json(cart); 
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

module.exports = router;
