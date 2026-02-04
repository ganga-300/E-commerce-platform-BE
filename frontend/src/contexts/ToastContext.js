"use client"
import React, { createContext, useContext } from 'react';
import { toast } from 'sonner';

const ToastContext = createContext();

export function ToastProvider({ children }) {
    // Wrapper to maintain API compatibility with existing code
    const showToast = (message, type = 'success') => {
        if (type === 'error') {
            toast.error(message);
        } else {
            toast.success(message);
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
