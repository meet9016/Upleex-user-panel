'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService, CartItem } from '@/services/cartService';
import { toast } from 'react-hot-toast';

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    loading: boolean;
    addToCart: (productId: string, qty: number) => Promise<void>;
    updateQuantity: (productId: string, qty: number) => Promise<void>;
    removeFromCart: (cartId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
    totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);

    const refreshCart = useCallback(async () => {
        try {
            setLoading(true);
            const response = await cartService.getCartList();
            if (response.status === 200) {
                setCartItems(response.data || []);
            }
        } catch (error) {
            console.error('Error refreshing cart:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const addToCart = async (productId: string, qty: number) => {
        try {
            const response = await cartService.addToCart(productId, qty);
            if ((response as any)?.status === 200 || (response as any)?.success === true) {
                toast.success('Successfully added to cart');
                setCartItems(prev => {
                    const existingIndex = prev.findIndex(item => item.id === productId);
                    if (existingIndex !== -1) {
                        const updated = [...prev];
                        const oldQty = parseInt(updated[existingIndex].qty || '1', 10) || 1;
                        updated[existingIndex] = {
                            ...updated[existingIndex],
                            qty: String(oldQty + (qty || 1)),
                        };
                        return updated;
                    }
                    return [
                        ...prev,
                        {
                            id: productId,
                            name: '',
                            price: '0',
                            qty: String(qty || 1),
                            sub_total: '0',
                            gst_per: '0',
                            gst_amount: '0',
                            final_amount: '0',
                            image: '',
                            cart_id: ''
                        }
                    ];
                });
                await refreshCart();
            } else {
                toast.error(response.message || 'Failed to add to cart');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
        }
    };

    const updateQuantity = async (productId: string, targetQty: number) => {
        try {
            const item = cartItems.find(ci => ci.id === productId);
            // If no existing item, treat as add
            if (!item) {
                if (targetQty > 0) {
                    const res = await cartService.addToCart(productId, targetQty);
                    if (res.status === 200 || (res as any)?.success === true) {
                        await refreshCart();
                        return;
                    }
                    toast.error((res as any)?.message || 'Failed to update quantity');
                    return;
                }
                return;
            }

            const current = parseInt(item.qty || '1', 10) || 1;

            // Remove if target is 0 or less
            if (targetQty <= 0) {
                const res = await cartService.removeFromCart(item.cart_id);
                if (res.status === 200 || (res as any)?.success === true) {
                    await refreshCart();
                } else {
                    toast.error((res as any)?.message || 'Failed to remove item');
                }
                return;
            }

            const delta = targetQty - current;
            if (delta === 0) return;

            const response = await cartService.addToCart(productId, delta);
            if (response.status === 200 || (response as any)?.success === true) {
                await refreshCart();
            } else {
                toast.error(response.message || 'Failed to update quantity');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
        }
    };

    const removeFromCart = async (cartId: string) => {
        try {
            const response = await cartService.removeFromCart(cartId);
            if (response.status === 200) {
                toast.success('Item removed from cart');
                setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
                await refreshCart();
            } else {
                toast.error(response.message || 'Failed to remove item');
            }
        } catch (error) {
            toast.error('Something went wrong');
            console.error(error);
        }
    };

    useEffect(() => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            refreshCart();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onStorage = () => {
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            if (!token) {
                setCartItems([]);
            } else {
                refreshCart();
            }
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('storage', onStorage);
            return () => {
                window.removeEventListener('storage', onStorage);
            };
        }
    }, [refreshCart]);

    const cartCount = cartItems.length;
    const totalAmount = cartItems.reduce((acc, item) => acc + parseFloat(item.final_amount), 0);

    return (
        <CartContext.Provider value={{ cartItems, cartCount, loading, addToCart, updateQuantity, removeFromCart, refreshCart, totalAmount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
