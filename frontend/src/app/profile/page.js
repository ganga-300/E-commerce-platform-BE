"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { User, MapPin, Plus, Trash2, Home, Briefcase, CheckCircle, Loader2 } from "lucide-react"

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
            }
        } catch (error) {
            alert("Failed to add address")
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
            }
        } catch (error) {
            alert("Failed to delete address")
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 bg-[#637D37]/10 rounded-full flex items-center justify-center text-[#637D37] text-2xl font-bold mb-3">
                                {user.userName?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="font-bold text-gray-900">{user.userName}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>

                        <nav className="space-y-2">
                            <button
                                onClick={() => setActiveTab("profile")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "profile" ? "bg-[#637D37] text-white" : "text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                Profile Info
                            </button>
                            <button
                                onClick={() => setActiveTab("addresses")}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === "addresses" ? "bg-[#637D37] text-white" : "text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                <MapPin className="w-5 h-5" />
                                Addresses
                            </button>
                        </nav>

                        <button
                            onClick={logout}
                            className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8">
                        {activeTab === "profile" && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={user.userName}
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <input
                                            type="text"
                                            value={user.role}
                                            disabled
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 mt-8">
                                    <p className="text-sm text-yellow-800">
                                        Note: To check your order history, please visit the "My Orders" page from the main menu.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === "addresses" && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="flex items-center gap-2 bg-[#637D37] text-white px-4 py-2 rounded-lg hover:bg-[#52682d] transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New
                                    </button>
                                </div>

                                {loadingAddresses ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-[#637D37]" />
                                    </div>
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl">
                                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No saved addresses found</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className="border border-gray-100 rounded-xl p-6 relative group hover:shadow-md transition-shadow">
                                                {addr.isDefault && (
                                                    <span className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> Default
                                                    </span>
                                                )}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        {addr.title === "Home" ? <Home className="w-5 h-5 text-[#637D37]" /> : <Briefcase className="w-5 h-5 text-blue-600" />}
                                                        <h3 className="font-bold text-gray-900">{addr.title}</h3>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-gray-900 font-medium">{addr.name}</p>
                                                <p className="text-gray-600 text-sm mt-1">{addr.address}</p>
                                                <p className="text-gray-600 text-sm">{addr.city}, {addr.state} {addr.zip}</p>
                                                <p className="text-gray-600 text-sm mt-2 flex items-center gap-2">
                                                    <span className="font-semibold">Phone:</span> {addr.phone}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Address Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg animate-in zoom-in duration-300">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Address</h3>
                        <form onSubmit={handleAddAddress} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newAddress.title}
                                        onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Work">Work</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newAddress.name}
                                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    required
                                    rows="2"
                                    className="w-full px-3 py-2 border rounded-lg"
                                    value={newAddress.address}
                                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newAddress.zip} onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="default"
                                    checked={newAddress.isDefault}
                                    onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                    className="w-4 h-4 text-[#637D37] border-gray-300 rounded focus:ring-[#637D37]"
                                />
                                <label htmlFor="default" className="text-sm text-gray-700">Set as default address</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#637D37] text-white rounded-lg hover:bg-[#52682d]"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
