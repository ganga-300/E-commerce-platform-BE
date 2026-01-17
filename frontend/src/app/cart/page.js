"use client";

import CartItems from "@/app/features/cart/components/CartItems";
import PaymentSummary from "@/app/features/cart/components/PaymentSummary";

export default function CartPage() {
  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      

      <div className="max-w-7xl mx-auto p-6 flex flex-col lg:flex-row gap-8">
        <CartItems />
        <PaymentSummary />
      </div>
    </div>
  );
}
