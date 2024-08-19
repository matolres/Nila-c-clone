"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const ShoppingBagContext = createContext();

export const ShoppingBagProvider = ({ children }) => {
    const [bag, setBag] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedBag = sessionStorage.getItem('shoppingBag');
            return savedBag ? JSON.parse(savedBag) : [];
        }
        return [];
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setBag(prevBag => {
                const now = Date.now();
                const filteredBag = prevBag.filter(item => now < item.expiry);
                if (filteredBag.length !== prevBag.length) {
                    if (typeof window !== 'undefined') {
                        sessionStorage.setItem('shoppingBag', JSON.stringify(filteredBag));
                    }
                    return filteredBag;
                }
                return prevBag;
            });
        }, 300000);

        return () => clearInterval(interval);
    }, []);

    const addToBag = (product) => {
        let status = 'added';
        setBag(prevBag => {
            const isProductInBag = prevBag.some(item => item.product.id === product.id);
            if (isProductInBag) {
                status = 'exists';
                return prevBag;
            } else {
                const updatedBag = [...prevBag, { product: product, timestamp: Date.now(), expiry: Date.now() + 15 * 60 * 1000 }];
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('shoppingBag', JSON.stringify(updatedBag));
                }
                return updatedBag;
            }
        });
        return { status };
    };

    const removeFromBag = (productId) => {
        setBag(prevBag => {
            const updatedBag = prevBag.filter(item => item.product.id !== productId);
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('shoppingBag', JSON.stringify(updatedBag));
            }
            return updatedBag;
        });
    };

    const bagCount = bag.length;

    return (
        <ShoppingBagContext.Provider value={{ bag, bagCount, addToBag, removeFromBag }}>
            {children}
        </ShoppingBagContext.Provider>
    );
};

export const useShoppingBag = () => useContext(ShoppingBagContext);
