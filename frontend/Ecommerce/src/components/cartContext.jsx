import React, { createContext, useReducer, useContext, useEffect } from 'react';

const initialState = {
    cart: [],
};

const CartContext = createContext(initialState);

export const cartReducer = (state, action) => {
    switch (action.type) {
        case "SET_CART":
            return {
                ...state,
                cart: action.payload,
            };
        case "ADD_TO_CART": {
            const itemExists = state.cart.find(item => item.productName === action.payload.productName);
            if (itemExists) {
                return {
                    ...state,
                    cart: state.cart.map(item =>
                        item.productName === action.payload.productName
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    cart: [...state.cart, { ...action.payload, quantity: 1 }],
                };
            }
        }
        case "REMOVE_FROM_CART":
            return {
                ...state,
                cart: state.cart.filter((_, index) => index !== action.payload),
            };
        case "INCREASE_QUANTITY":
            return {
                ...state,
                cart: state.cart.map((item, index) =>
                    index === action.payload
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            };
        case "DECREASE_QUANTITY":
            return {
                ...state,
                cart: state.cart.map((item, index) =>
                    index === action.payload && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ),
            };
        case "CLEAR_CART":
            return {
                ...state,
                cart: [],
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        const fetchCartItems = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:8080/cart', {
                    headers: {
                        method: "GET",
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to fetch cart items:", response.statusText);
                    return;
                }

                const data = await response.json();
                console.log("Fetched cart items:", data);
                dispatch({ type: "SET_CART", payload: data.items || [] });
            } catch (error) {
                console.error("Error fetching cart items:", error);
            }
        };

        fetchCartItems();
    }, []); 

    useEffect(() => {
        const updateCartInDB = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                await fetch('http://localhost:8080/cart', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ items: state.cart }),
                });
            } catch (error) {
                console.error("Error updating cart in DB:", error);
            }
        };

        if (state.cart.length > 0) {
            updateCartInDB();
        }
    }, [state.cart]);

    const clearCartInDB = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch('http://localhost:8080/cart', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Error clearing cart in DB:", error);
        }
    };

    const handleClearCart = () => {
        clearCartInDB();
        dispatch({ type: "CLEAR_CART" });
    };

    const removeItemFromDB = async (index) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch(`http://localhost:8080/cart/item/${state.cart[index]._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error("Error removing item from DB:", error);
        }
    };

    const removeFromCart = (index) => {
        removeItemFromDB(index);
        dispatch({ type: "REMOVE_FROM_CART", payload: index });
    };

    return (
        <CartContext.Provider value={{ state, dispatch, clearCart: handleClearCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
