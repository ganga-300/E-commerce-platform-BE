"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user, token } = useAuth();
    const { showToast } = useToast();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!user || !token) {
            setWishlistItems([]);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/wishlist/${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setWishlistItems(data);
            }
        } catch (err) {
            console.error("Fetch Wishlist Error:", err);
        }
    }, [user, token]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const toggleWishlist = async (product) => {
        if (!user) {
            showToast("Please login to use wishlist", "error");
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/wishlist/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: user.id, productId: product.id }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.status === "added") {
                    setWishlistItems(prev => [...prev, product]);
                    showToast(`Added ${product.name} to wishlist`);
                } else {
                    setWishlistItems(prev => prev.filter(item => item.id !== product.id));
                    showToast(`Removed ${product.name} from wishlist`, "error");
                }
            } else {
                showToast("Failed to update wishlist", "error");
            }
        } catch (err) {
            console.error("Toggle Wishlist Error:", err);
            showToast("Something went wrong", "error");
        }
    };

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
