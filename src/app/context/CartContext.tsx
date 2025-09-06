'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { createCheckout, addToCheckout } from '../utils/shopify-fallback';

interface CartItem {
  variantId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  checkoutId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { variantId: string; quantity: number } }
  | { type: 'SET_CHECKOUT'; payload: { checkoutId: string; checkoutUrl: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  getCheckoutUrl: () => Promise<string | null>;
  clearCart: () => void;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.variantId === action.payload.variantId);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
        total: state.total + action.payload.price
      };
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find(item => item.variantId === action.payload);
      return {
        ...state,
        items: state.items.filter(item => item.variantId !== action.payload),
        total: state.total - (item ? item.price * item.quantity : 0)
      };
    }
    case 'UPDATE_QUANTITY': {
      const item = state.items.find(item => item.variantId === action.payload.variantId);
      if (!item) return state;
      
      const quantityDiff = action.payload.quantity - item.quantity;
      return {
        ...state,
        items: state.items.map(item =>
          item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff)
      };
    }
    case 'SET_CHECKOUT':
      return {
        ...state,
        checkoutId: action.payload.checkoutId,
        checkoutUrl: action.payload.checkoutUrl
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'CLEAR_CART':
      return {
        items: [],
        checkoutId: null,
        checkoutUrl: null,
        isLoading: false,
        total: 0
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    checkoutId: null,
    checkoutUrl: null,
    isLoading: false,
    total: 0
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('bourbon-budz-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({ type: 'ADD_ITEM', payload: item });
        });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bourbon-budz-cart', JSON.stringify({
      items: state.items,
      checkoutId: state.checkoutId
    }));
  }, [state.items, state.checkoutId]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
  };

  const removeFromCart = (variantId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: variantId });
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { variantId, quantity } });
    }
  };

  const getCheckoutUrl = async (): Promise<string | null> => {
    if (state.items.length === 0) return null;

    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Create or update checkout
      let checkoutId = state.checkoutId;
      
      if (!checkoutId) {
        const checkout = await createCheckout();
        if (!checkout) throw new Error('Failed to create checkout');
        checkoutId = checkout.id;
      }

      // Add items to checkout
      const lineItemsToAdd = state.items.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
      }));

      if (!checkoutId) {
        throw new Error('No checkout ID available');
      }

      const updatedCheckout = await addToCheckout(checkoutId, lineItemsToAdd);
      if (!updatedCheckout) throw new Error('Failed to add items to checkout');

      dispatch({
        type: 'SET_CHECKOUT',
        payload: {
          checkoutId: updatedCheckout.id,
          checkoutUrl: updatedCheckout.webUrl
        }
      });

      return updatedCheckout.webUrl;
    } catch (error) {
      console.error('Error creating checkout:', error);
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('bourbon-budz-cart');
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCheckoutUrl,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
