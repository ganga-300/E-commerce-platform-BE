"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    MapPin,
    Plus,
    Trash2,
    Home,
    Briefcase,
    CheckCircle,
    Loader2,
    Shield,
    Settings,
    LogOut,
    CreditCard
} from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
    const { user, token, logout } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("profile")
    const [addresses, setAddresses] = useState([])
    const [loadingAddresses, setLoadingAddresses] = useState(false)
    const [showAddModal, setShowAddModal] = useState(false)
    const [newAddress, setNewAddress] = useState({
        title: "Home",
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false
    })

    useEffect(() => {
        if (!user) {
            router.push("/login")
            return
        }
        if (activeTab === "addresses") {
            fetchAddresses()
        }
    }, [user, activeTab])

    const fetchAddresses = async () => {
        setLoadingAddresses(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/address`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (res.ok) {
                const data = await res.json()
                setAddresses(data)
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error)
            toast.error("Failed to load addresses")
        } finally {
            setLoadingAddresses(false)
        }
    }

    const handleAddAddress = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newAddress)
            })

            if (res.ok) {
                setShowAddModal(false)
                fetchAddresses()
                setNewAddress({
                    title: "Home",
                    name: "",
                    phone: "",
                    address: "",
                    city: "",
                    state: "",
                    zip: "",
                    isDefault: false
                })
                toast.success("Address added successfully")
            }
        } catch (error) {
            toast.error("Failed to add address")
        }
    }

    const handleDeleteAddress = async (id) => {
        if (!confirm("Are you sure you want to delete this address?")) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/user/address/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                fetchAddresses()
                toast.success("Address deleted")
            }
        } catch (error) {
            toast.error("Failed to delete address")
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-80 space-y-6">
                        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary text-3xl font-black mx-auto">
                                    {user.userName?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-card"></div>
                            </div>
                            <h2 className="text-xl font-bold text-foreground mb-1">{user.userName}</h2>
                            <p className="text-sm text-muted-foreground mb-6">{user.email}</p>

                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                <Shield className="w-3 h-3" /> {user.role || 'Member'}
                            </div>
                        </div>

                        <nav className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm p-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold text-sm ${activeTab === "profile"
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                Personal Info
                            </button>
                            <button
                                onClick={() => setActiveTab("addresses")}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold text-sm ${activeTab === "addresses"
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <MapPin className="w-5 h-5" />
                                My Addresses
                            </button>
                            <button
                                onClick={() => router.push('/orders')}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                                <CreditCard className="w-5 h-5" />
                                Orders & Returns
                            </button>

                            <div className="my-2 border-t border-border/50"></div>

                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 font-bold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                <LogOut className="w-5 h-5" />
                                Sign Out
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            {activeTab === "profile" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
                                >
                                    <div className="p-8 border-b border-border">
                                        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
                                        <p className="text-muted-foreground">Manage your account details and preferences.</p>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">Full Name</label>
                                                <div className="px-4 py-3 bg-muted/50 rounded-xl border border-transparent font-medium text-foreground">
                                                    {user.userName}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">Email Address</label>
                                                <div className="px-4 py-3 bg-muted/50 rounded-xl border border-transparent font-medium text-foreground">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-muted-foreground">Account Role</label>
                                                <div className="px-4 py-3 bg-muted/50 rounded-xl border border-transparent font-medium text-foreground flex items-center gap-2">
                                                    <Shield className="w-4 h-4 text-primary" />
                                                    {user.role}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 mt-8 flex gap-4">
                                            <div className="bg-white dark:bg-card p-3 rounded-full h-fit shadow-sm">
                                                <CreditCard className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-foreground mb-1">Looking for your orders?</h4>
                                                <p className="text-sm text-muted-foreground mb-4">
                                                    Track your packages and view your complete order history in the Orders section.
                                                </p>
                                                <button
                                                    onClick={() => router.push('/orders')}
                                                    className="text-sm font-bold text-primary hover:underline"
                                                >
                                                    View Order History →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "addresses" && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
                                >
                                    <div className="p-8 border-b border-border flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-foreground">Saved Addresses</h2>
                                            <p className="text-muted-foreground">Manage your shipping destinations.</p>
                                        </div>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-md shadow-primary/20"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add New
                                        </button>
                                    </div>

                                    <div className="p-8">
                                        {loadingAddresses ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            </div>
                                        ) : addresses.length === 0 ? (
                                            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-muted/30">
                                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <MapPin className="w-8 h-8 text-muted-foreground" />
                                                </div>
                                                <h3 className="font-bold text-foreground mb-1">No addresses saved</h3>
                                                <p className="text-muted-foreground mb-6">Add an address to speed up checkout.</p>
                                                <button
                                                    onClick={() => setShowAddModal(true)}
                                                    className="text-primary font-bold hover:underline"
                                                >
                                                    Add your first address
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                {addresses.map((addr) => (
                                                    <div key={addr.id} className="border border-border rounded-2xl p-6 relative group hover:border-primary/50 hover:shadow-md transition-all bg-card">
                                                        {addr.isDefault && (
                                                            <span className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider">
                                                                <CheckCircle className="w-3 h-3" /> Default
                                                            </span>
                                                        )}
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-2 rounded-lg ${addr.title === "Home" ? "bg-blue-100/50 text-blue-600" : "bg-purple-100/50 text-purple-600"}`}>
                                                                    {addr.title === "Home" ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-foreground text-lg">{addr.title}</h3>
                                                                    <p className="text-xs font-bold text-muted-foreground uppercase">{addr.name}</p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDeleteAddress(addr.id)}
                                                                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="pl-[52px]">
                                                            <p className="text-foreground/80 text-sm leading-relaxed">{addr.address}</p>
                                                            <p className="text-foreground/80 text-sm">{addr.city}, {addr.state} <span className="font-medium text-primary">{addr.zip}</span></p>
                                                            <p className="text-muted-foreground text-xs mt-3 font-medium flex items-center gap-2 bg-muted/50 w-fit px-2 py-1 rounded-md">
                                                                Phone: <span className="text-foreground">{addr.phone}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-card border border-border rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-foreground">Add New Address</h3>
                                <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground">
                                    <LogOut className="w-5 h-5 rotate-45" />
                                </button>
                            </div>

                            <form onSubmit={handleAddAddress} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Label</label>
                                        <select
                                            className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            value={newAddress.title}
                                            onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                                        >
                                            <option value="Home">Home</option>
                                            <option value="Work">Work</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Address</label>
                                    <textarea
                                        required
                                        rows="2"
                                        className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                        value={newAddress.address}
                                        onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                    ></textarea>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">City</label>
                                        <input required type="text" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">State</label>
                                        <input required type="text" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">ZIP Code</label>
                                        <input required type="text" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-muted-foreground mb-1">Phone</label>
                                        <input required type="text" className="w-full px-4 py-2.5 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-medium" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <input
                                        type="checkbox"
                                        id="default"
                                        checked={newAddress.isDefault}
                                        onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                        className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                                    />
                                    <label htmlFor="default" className="text-sm font-medium text-foreground">Set as default address</label>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-4 py-3 border border-border text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
                                    >
                                        Save Address
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
