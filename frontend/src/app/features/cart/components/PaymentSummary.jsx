"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function PaymentSummary() {
  const { quantity } = useCart();
  const cartItems = Object.values(quantity);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="w-full lg:w-96 pt-20">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Payment Summary
        </h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total MRP</span>
            <span className="font-semibold">₹{totalPrice}</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>− ₹0</span>
          </div>

          <div className="flex justify-between text-green-600">
            <span>Coupon Savings</span>
            <span>− ₹0</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">GST</span>
            <span>₹0</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span className="text-green-600 font-semibold">Free</span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount</span>
              <span className="text-[#728F41]">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-[#728F41] hover:bg-[#5f7220] text-white font-bold py-4 mt-6 rounded-lg transition flex items-center justify-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          PLACE ORDER
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          🔒 Secure checkout guaranteed
        </p>
      </div>
    </div>
  );
}
