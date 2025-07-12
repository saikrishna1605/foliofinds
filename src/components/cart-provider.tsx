"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './auth-provider';
import type { Cart, CartItem } from '@/lib/types';
import { getCart, addToCart as addToCartAction, removeFromCart as removeFromCartAction } from '@/app/cart/actions';
import { useToast } from '@/hooks/use-toast';

type CartContextType = {
    cart: Cart | null;
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;
    addToCart: (item: CartItem) => Promise<void>;
    removeFromCart: (itemId: string) => Promise<void>;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadCart = useCallback(async () => {
        if (user) {
            setIsLoading(true);
            const userCart = await getCart(user.uid);
            setCart(userCart);
            setIsLoading(false);
        } else {
            setCart(null);
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            loadCart();
        }
    }, [user, authLoading, loadCart]);
    
    const addToCart = async (item: CartItem) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Please log in to add items to your cart.' });
            return;
        }

        const updatedCart = await addToCartAction(user.uid, item);

        if (updatedCart) {
            setCart(updatedCart);
            toast({ title: 'Added to Cart', description: `"${item.title}" has been added to your cart.` });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not add item to cart.' });
        }
    };

    const removeFromCart = async (itemId: string) => {
        if (!user) return;
        
        const updatedCart = await removeFromCartAction(user.uid, itemId);
        if (updatedCart) {
            setCart(updatedCart);
            toast({ title: 'Item Removed', description: 'The item has been removed from your cart.' });
        } else {
            toast({ variant: 'destructive', title: 'Error', description: 'Could not remove item from cart.' });
        }
    };

    const clearCart = () => {
        setCart(null);
    };
    
    const cartCount = cart?.items.length || 0;
    const cartTotal = cart?.items.reduce((total, item) => total + item.price, 0) || 0;

    return (
        <CartContext.Provider value={{ cart, cartCount, cartTotal, isLoading: authLoading || isLoading, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
