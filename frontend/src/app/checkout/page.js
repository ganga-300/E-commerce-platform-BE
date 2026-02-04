"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Package,
  Truck,
  Star,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { indianStates } from "../../data/indianStates"
import { toast } from "sonner"

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
    district: "",
    zip: ""
  })
  const [paymentStatus, setPaymentStatus] = useState("pending")
  const [orderNumber, setOrderNumber] = useState("")
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

  const handleProceedToAddress = () => {
    setCurrentStep(2)
  }

  const handleProceedToPayment = () => {
    if (!address.address || !address.city || !address.state || !address.district || !address.phone || !address.zip) {
      toast.error("Please fill in all required shipping details")
      return
    }
    setCurrentStep(3)
  }

  const handlePaymentComplete = async () => {
    if (!user || !token) {
      toast.error("Please login to complete payment")
      router.push("/login")
      return
    }

    setPaymentStatus("processing")
    const toastId = toast.loading("Initializing secure payment...")

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/payment/create-order`;

      if (!totalAmount || totalAmount <= 0) {
        throw new Error("Cart is empty or total amount is 0.");
      }

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

      const rzpKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!rzpKeyId) throw new Error("Razorpay config missing");

      const options = {
        key: rzpKeyId,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: "StudyStuff",
        description: "Premium Stationery Purchase",
        order_id: rzpOrder.id,
        handler: async (response) => {
          toast.dismiss(toastId)
          toast.loading("Verifying payment...", { id: toastId })

          const verifyRes = await fetch(`${apiUrl}/api/payment/verify`, {
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
            const placeOrderRes = await fetch(`${apiUrl}/api/orders/place/${user.id}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                items: cartItems,
                shippingDetails: {
                  ...address,
                  address: `${address.address}, District: ${address.district}`
                },
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
              toast.success("Order confirmed successfully!", { id: toastId })
            } else {
              throw new Error("Order placement failed")
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
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus("pending")
            toast.dismiss(toastId)
            toast.info("Payment cancelled")
          }
        }
      }

      const rzp1 = new window.Razorpay(options)
      rzp1.open()

    } catch (err) {
      toast.error(err.message, { id: toastId })
      setPaymentStatus("pending")
    }
  }

  const steps = [
    { number: 1, title: "Review", description: "Cart Items" },
    { number: 2, title: "Address", description: "Shipping" },
    { number: 3, title: "Payment", description: "Checkout" },
    { number: 4, title: "Done", description: "Confirmation" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white/80 dark:bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">Secure Checkout</h1>
              <p className="text-xs text-muted-foreground">Order ID: {orderNumber}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between max-w-3xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center bg-background px-2">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: currentStep >= step.number ? "var(--primary)" : "var(--muted)",
                    color: currentStep >= step.number ? "var(--primary-foreground)" : "var(--muted-foreground)",
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-sm"
                >
                  {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                </motion.div>
                <span className={`text-xs font-semibold ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-2 space-y-6"
            >
              {currentStep === 1 && (
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Review Your Cart
                  </h2>
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-xl hover:bg-muted transition-colors">
                        <div className="relative w-24 h-24 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-border">
                          <Image
                            src={item.imageUrl || item.image || "/placeholder.jpg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 className="font-bold text-foreground text-lg mb-1">{item.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="bg-background px-3 py-1 rounded-md text-xs font-bold border border-border">
                              Qty: {item.qty}
                            </div>
                            <p className="text-primary font-black text-lg">₹{item.price * item.qty}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                  <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={address.name}
                        onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Address</label>
                      <textarea
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        rows="2"
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        placeholder="Street, Building, Landmark"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">State</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value, district: "" })}
                      >
                        <option value="">Select State</option>
                        {Object.keys(indianStates).map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">District</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={address.district}
                        onChange={(e) => setAddress({ ...address, district: e.target.value })}
                        disabled={!address.state}
                      >
                        <option value="">Select District</option>
                        {address.state && indianStates[address.state]?.map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">City</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Zip Code</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase text-muted-foreground mb-1 block">Mobile</label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        placeholder="10-digit number"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-card rounded-2xl p-8 border border-border shadow-sm text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 text-primary">
                    <Shield className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-foreground mb-2">Secure Payment</h2>
                  <p className="text-muted-foreground mb-8">Click below to proceed to Razorpay secure gateway.</p>

                  <div className="max-w-md mx-auto bg-muted/30 rounded-2xl p-6 mb-8 border border-border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold uppercase text-muted-foreground">Total to Pay</span>
                      <span className="text-2xl font-black text-primary">₹{totalAmount}</span>
                    </div>
                    <div className="h-px bg-border my-4"></div>
                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-3 h-3" /> 128-bit SSL Encrypted
                    </div>
                  </div>

                  <button
                    onClick={handlePaymentComplete}
                    disabled={paymentStatus === "processing"}
                    className="w-full max-w-sm bg-primary text-primary-foreground font-black py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
                  >
                    {paymentStatus === "processing" ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      "PAY NOW"
                    )}
                  </button>
                </div>
              )}

              {currentStep === 4 && (
                <div className="bg-card rounded-2xl p-12 border border-border shadow-sm text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
                  >
                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <h2 className="text-3xl font-black text-foreground mb-4">Order Placed!</h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
                    Thank you, {address.name}. Your order has been confirmed and will ship soon.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push("/orders")}
                      className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all"
                    >
                      View Order
                    </button>
                    <button
                      onClick={() => router.push("/")}
                      className="px-8 py-3 bg-muted text-foreground font-bold rounded-xl hover:bg-muted/80 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Right Summary Column */}
          {/* Only show summary on steps 1, 2, 3 */}
          {(currentStep >= 1 && currentStep <= 3) && (
            <div className="lg:col-span-1 lg:sticky lg:top-24">
              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <h3 className="font-bold text-lg text-foreground mb-4">Order Summary</h3>
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="h-px bg-border my-2"></div>
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-foreground">Total</span>
                    <span className="font-black text-2xl text-primary">₹{totalAmount}</span>
                  </div>
                </div>

                {currentStep === 1 && (
                  <button
                    onClick={handleProceedToAddress}
                    className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    Continue to Address
                  </button>
                )}
                {currentStep === 2 && (
                  <button
                    onClick={handleProceedToPayment}
                    className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    Continue to Payment
                  </button>
                )}
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="w-full mt-3 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-2"
                  >
                    Go Back
                  </button>
                )}
              </div>

              <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-3 text-blue-700 dark:text-blue-300 text-xs font-medium">
                <Truck className="w-5 h-5 flex-shrink-0" />
                <p>Free delivery on all orders this week! Estimated arrival: 3-5 days.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}