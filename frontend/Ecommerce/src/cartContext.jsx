import React, { createContext, useReducer, useContext, useEffect } from 'react';

const initialState = {
    cart: [], 
};

const CartContext = createContext(initialState);

export const cartReducer = (state, action) => {
    switch (action.type) {
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
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        if (Array.isArray(storedCart)) {
            dispatch({ type: "LOAD_CART", payload: storedCart }); 
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state.cart));
    }, [state.cart]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};
