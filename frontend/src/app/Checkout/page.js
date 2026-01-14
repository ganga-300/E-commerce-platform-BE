"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle,
  QrCode,
  Smartphone,
  Copy,
  RefreshCw,
  Package,
  Truck,
  Star,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"

export default function ProfessionalCheckout() {
  const { user, token } = useAuth()
  const { quantity: cart, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [address, setAddress] = useState({
    name: user?.userName || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: ""
  })
  const [paymentStatus, setPaymentStatus] = useState("pending")
  const [timeLeft, setTimeLeft] = useState(600)
  const [orderNumber, setOrderNumber] = useState("")
  const [paymentVerified, setPaymentVerified] = useState(false)
  const router = useRouter()

  const cartItems = Object.values(cart)
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0)


  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    // Set Order Number
    setOrderNumber(`SS${Date.now().toString().slice(-6)}`)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (currentStep === 3 && paymentStatus === "pending" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentStep, paymentStatus, timeLeft])


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleProceedToAddress = () => {
    setCurrentStep(2)
  }

  const handleProceedToPayment = () => {
    // Validate address
    if (!address.address || !address.city || !address.phone) {
      alert("Please fill in the required shipping details")
      return
    }
    setCurrentStep(3)
  }

  const handlePaymentComplete = async () => {
    if (!user || !token) {
      alert("Please login to complete payment")
      router.push("/login")
      return
    }

    setPaymentStatus("processing")

    try {
      // 1. Create Razorpay Order in Backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/payment/create-order`;

      console.log("DEBUG: Calling Create Order", {
        url: endpoint,
        method: "POST",
        tokenBefore: token ? "Present (Starts with " + token.substring(0, 10) + "...)" : "Missing",
        body: {
          amount: totalAmount,
          currency: "INR",
          receipt: orderNumber
        }
      });

      const orderResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: "INR",
          receipt: orderNumber
        })
      })

      if (!orderResponse.ok) throw new Error("Failed to create payment order")
      const rzpOrder = await orderResponse.json()

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "StudyStuff",
        description: "Premium Stationery Purchase",
        order_id: rzpOrder.id,
        handler: async (response) => {
          // 3. Verify Payment Signature
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          })

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            // 4. Place Actual Order in Database
            const placeOrderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/orders/place/${user.id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                items: cartItems,
                shippingDetails: address,
                paymentDetails: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id
                }
              })
            })

            if (placeOrderRes.ok) {
              setPaymentStatus("completed")
              clearCart()
              setCurrentStep(4)
            } else {
              throw new Error("Payment verified but order placement failed")
            }
          } else {
            throw new Error("Payment verification failed")
          }
        },
        prefill: {
          name: address.name,
          email: user.email,
          contact: address.phone
        },
        theme: {
          color: "#637D37"
        }
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.on('payment.failed', function (response) {
        alert(response.error.description);
        setPaymentStatus("pending")
      });
      rzp1.open()

    } catch (err) {
      alert(`Error: ${err.message}`)
      setPaymentStatus("pending")
    }
  }

  const copyUPIId = () => {
    navigator.clipboard.writeText("ganga@upi")
    // You could add a toast notification here
  }

  const steps = [
    { number: 1, title: "Review", description: "Review items" },
    { number: 2, title: "Address", description: "Shipping info" },
    { number: 3, title: "Payment", description: "Complete pay" },
    { number: 4, title: "Done", description: "Confirmation" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
              {orderNumber && <p className="text-sm text-gray-500">Order #{orderNumber}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${currentStep >= step.number ? "bg-[#637D37] text-white" : "bg-gray-200 text-gray-500"
                      }`}
                  >
                    {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-800">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all ${currentStep > step.number ? "bg-[#637D37]" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>


        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Your Items
                </h2>
                <div className="space-y-4">

                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imageUrl || item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[#637D37] font-semibold">₹{item.price} × {item.qty}</p>
                          <p className="text-lg font-bold text-gray-800">₹{item.price * item.qty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Delivery Information
                </h2>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Free Delivery</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Standard Shipping - Usually arrives in 3-5 business days</p>
                </div>
              </div>
            </div>


            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border lg:sticky lg:top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items Total</span>
                    <span className="font-semibold">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Delivery</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹0</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-[#637D37]">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToAddress}
                  className="w-full bg-[#637D37] hover:bg-[#4a5a2a] text-white font-bold py-4 mt-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  PROCEED TO ADDRESS
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4" />
                  Secure checkout guaranteed
                </div>
              </div>
            </div>
          </div>
        )}


        {currentStep === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#637D37]" />
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#637D37] outline-none"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#637D37] outline-none"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <textarea
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#637D37] outline-none"
                      rows="3"
                      value={address.address}
                      onChange={(e) => setAddress({ ...address, address: e.target.value })}
                      placeholder="House No, Street, Landmark"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#637D37] outline-none"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#637D37] outline-none"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#637D37] outline-none"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      placeholder="6-digit ZIP code"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border lg:sticky lg:top-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items Total</span>
                    <span className="font-semibold">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#637D37] hover:bg-[#4a5a2a] text-white font-bold py-4 rounded-lg transition-all"
                >
                  PROCEED TO PAYMENT
                </button>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="w-full mt-3 text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  Back to Review
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm border text-center">
              {paymentStatus === "pending" && (
                <>
                  <div className="mb-8">
                    <div className="w-20 h-20 bg-[#637D37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Shield className="w-10 h-10 text-[#637D37]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Secure Payment Gateway</h2>
                    <p className="text-gray-500 font-medium">You are about to be redirected to our secure Razorpay portal.</p>
                  </div>

                  <div className="bg-gray-50 rounded-3xl p-8 mb-8 border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Order Reference</span>
                      <span className="text-gray-900 font-black">{orderNumber}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-4">
                      <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Items Count</span>
                      <span className="text-gray-900 font-black">{cartItems.length} Products</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-black text-lg">Total Payable</span>
                      <span className="text-[#637D37] font-black text-2xl">₹{totalAmount}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button
                      onClick={handlePaymentComplete}
                      disabled={paymentStatus === "processing"}
                      className="w-full bg-[#637D37] hover:bg-[#4a5a2a] disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black py-5 rounded-2xl shadow-xl shadow-[#637D37]/20 hover:shadow-[#637D37]/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                    >
                      {paymentStatus === "processing" ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      )}
                      {paymentStatus === "processing" ? "VERIFYING SECURELY..." : "SECURELY PAY WITH RAZORPAY"}
                    </button>

                    <p className="text-[11px] text-gray-400 font-medium text-center flex items-center justify-center gap-1.5">
                      <Shield className="w-3 h-3" />
                      128-bit SSL Encrypted secure transaction. No card details are stored.
                    </p>
                  </div>
                </>
              )}

              {paymentStatus === "processing" && (
                <div className="py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
                  <p className="text-gray-600">Please wait while we verify your payment...</p>
                </div>
              )}
            </div>
          </div>
        )}


        {currentStep === 4 && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl p-8 shadow-sm border">
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h2>
                <p className="text-gray-600 text-lg">Thank you for your purchase</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-green-800 mb-2">Order #{orderNumber}</h3>
                <p className="text-green-700">Your stationery items will be shipped to your address shortly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Payment Details</h4>
                  <p className="text-sm text-gray-600">Amount Paid: ₹{totalAmount}</p>
                  <p className="text-sm text-gray-600">Payment Method: UPI</p>
                  <p className="text-sm text-gray-600">Status: Completed</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Delivery Info</h4>
                  <p className="text-sm text-gray-600">Type: Standard Shipping</p>
                  <p className="text-sm text-gray-600">Status: Preparing</p>
                  <p className="text-sm text-gray-600">Estimated Delivery: 3-5 Days</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/downloads")}
                  className="w-full bg-[#637D37] hover:bg-[#4a5a2a] text-white font-bold py-3 rounded-lg transition-colors"
                >
                  ACCESS YOUR MATERIALS
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full border-2 border-[#637D37] text-[#637D37] hover:bg-[#637D37] hover:text-white font-bold py-3 rounded-lg transition-colors"
                >
                  CONTINUE SHOPPING
                </button>
              </div>

              {/* Rating Request */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-gray-600 mb-3">How was your experience?</p>
                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="p-1 hover:scale-110 transition-transform">
                      <Star className="w-6 h-6 text-gray-300 hover:text-yellow-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}