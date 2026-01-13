"use client";
import { Plus, Minus, Heart, Trash2, BookOpen, GraduationCap, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CartItems() {
  const { quantity, addItem, removeItem } = useCart();
  const router = useRouter();

  const cartItems = Object.values(quantity);

  const handleContinueShopping = () => {
    router.push("/");
  };

  
  if (cartItems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#728F41]/10 to-[#728F41]/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-16 h-16 text-[#728F41]/60" strokeWidth={1.5} />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#728F41] rounded-full flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Study Cart is Empty</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Looks like you haven't added any study materials yet. Discover amazing books, notes, and resources to boost your learning journey!
          </p>

          <div className="space-y-3">
            <button
              onClick={handleContinueShopping}
              className="w-full bg-[#728F41] hover:bg-[#5f7220] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5" /> Start Shopping
            </button>

            <button
              onClick={() => router.push("/categories")}
              className="w-full border-2 border-[#728F41] text-[#728F41] hover:bg-[#728F41] hover:text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-5 h-5" /> Browse Categories
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex-1 space-y-4">
      {cartItems.map((product) => (
        <div
          key={product.name}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex gap-4">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-24 h-24 object-cover rounded-lg border"
            />

            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-800">{product.name}</h3>
                <button className="p-1 hover:bg-gray-100 rounded-full">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                </button>
              </div>

              <p className="text-[#728F41] font-semibold text-lg mb-4">₹{product.price}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center bg-gray-50 rounded-lg border">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-l-lg"
                    onClick={() => removeItem(product.name)}
                  >
                    <Minus className="w-4 h-4 text-gray-600" />
                  </button>
                  <span className="px-4 py-2 font-semibold">{product.qty}</span>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-r-lg"
                    onClick={() => addItem(product)}
                  >
                    <Plus className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <button className="p-2 hover:bg-red-50 rounded-full group">
                  <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="bg-white rounded-xl p-6 border-2 border-dashed border-gray-200">
        <div className="text-center">
          <p className="text-gray-600 mb-3">Need more study materials?</p>
          <button
            onClick={handleContinueShopping}
            className="text-[#728F41] hover:text-[#5f7220] font-semibold flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
