"use client"

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Link from 'next/link'
import Image from 'next/image'

export default function CartDrawer({ isOpen, onClose }) {
    const { quantity, addItem, removeItem, totalItems } = useCart()
    const drawerRef = useRef(null)

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.body.style.overflow = 'hidden' // Prevent scroll
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    const cartItems = Object.values(quantity)
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold font-heading flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-[#637D37]" />
                                Your Cart
                                <span className="text-sm font-normal text-muted-foreground ml-2">
                                    ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                                </span>
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold text-gray-900">Your cart is empty</p>
                                        <p className="text-gray-500 text-sm">Looks like you haven't added anything yet.</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="mt-4 px-6 py-2 bg-[#637D37] text-white rounded-full font-bold text-sm hover:bg-[#52682d] transition-colors"
                                    >
                                        Start Shopping
                                    </button>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div key={item.name} className="flex gap-4">
                                        <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                            {item.imageUrl || item.image ? (
                                                <Image
                                                    src={item.imageUrl || item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag className="w-8 h-8" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                                                    <p className="font-bold text-[#637D37] ml-2">
                                                        ₹{(item.price * item.qty).toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-gray-500">{item.family || 'Stationery'}</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                                    <button
                                                        onClick={() => removeItem(item.name)}
                                                        className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                                                    >
                                                        <Minus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                                                    <button
                                                        onClick={() => addItem(item)}
                                                        className="p-1 hover:bg-white rounded-md shadow-sm transition-all"
                                                    >
                                                        <Plus className="w-3 h-3 text-gray-600" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        // Remove all quantity? CartContext currently removes one by one or checks <= 1.
                                                        // I'll just call removeItem, user can click multiple times or I update context later to support 'remove completely'
                                                        removeItem(item.name)
                                                    }}
                                                    className="text-xs text-red-500 hover:text-red-600 font-medium underline decoration-red-200 hover:decoration-red-600 transition-all"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                                        <span>Total</span>
                                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" onClick={onClose}>
                                    <button className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-[#637D37] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                                        Checkout Now
                                    </button>
                                </Link>
                                <div className="mt-3 text-center">
                                    <Link href="/cart" onClick={onClose} className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
                                        View full cart
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
