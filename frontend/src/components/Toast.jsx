"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade-out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
        >
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-3 min-w-[320px]">
                {type === "success" ? (
                    <CheckCircle className="w-6 h-6 text-[#728F41]" />
                ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                )}
                <p className="flex-1 font-medium text-gray-800">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const ToastContainer = () => (
        <>
            {toasts.map((t) => (
                <Toast
                    key={t.id}
                    message={t.message}
                    type={t.type}
                    onClose={() => removeToast(t.id)}
                />
            ))}
        </>
    );

    return { showToast, ToastContainer };
};

export default Toast;
