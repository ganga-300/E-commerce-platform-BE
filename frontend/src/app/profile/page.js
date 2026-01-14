"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, Camera, ShieldCheck } from "lucide-react"

export default function ProfilePage() {
    const { user, token, loading: authLoading } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    // Profile State
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [profilePicture, setProfilePicture] = useState("")

    // Password State
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPasswords, setShowPasswords] = useState(false)

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login")
                return
            }
            setUserName(user.userName || "")
            setEmail(user.email || "")
            setPhoneNumber(user.phoneNumber || "")
            setProfilePicture(user.profilePicture || "")
        }
    }, [user, authLoading])

    const handleUpdateProfile = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        setError("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userName, phoneNumber, profilePicture })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to update profile")

            setMessage("Profile updated successfully!")
            // In a real app, you'd update the AuthContext user here too
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match")
            return
        }

        setLoading(true)
        setMessage("")
        setError("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to change password")

            setMessage("Password changed successfully!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="animate-spin text-[#637D37] w-12 h-12" />
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-10">
                    <h1 className="text-4xl font-black text-gray-900">Your Profile</h1>
                    <p className="text-gray-500 font-medium">Manage your personal information and security.</p>
                </header>

                {message && (
                    <div className="mb-8 p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
                        <ShieldCheck className="w-5 h-5" />
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-bold animate-in fade-in slide-in-from-top-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <User className="w-6 h-6 text-[#637D37]" />
                                Public Profile
                            </h2>

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                    <div className="relative group">
                                        <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-inner">
                                            {profilePicture ? (
                                                <img src={profilePicture} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <User className="w-10 h-10 text-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            className="absolute -bottom-2 -right-2 p-2 bg-[#637D37] text-white rounded-xl shadow-lg shadow-[#637D37]/30 hover:scale-110 transition-transform"
                                        >
                                            <Camera className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex-1 w-full space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                                                <div className="relative">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                                    <input
                                                        type="text"
                                                        value={userName}
                                                        onChange={(e) => setUserName(e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#637D37] outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                                    <input
                                                        type="tel"
                                                        value={phoneNumber}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#637D37] outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Email Address (Read Only)</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4" />
                                                <input
                                                    type="email"
                                                    disabled
                                                    value={email}
                                                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border-none rounded-2xl text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-8 py-3 bg-[#637D37] text-white rounded-xl font-bold shadow-lg shadow-[#637D37]/20 flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                                    >
                                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Password Section */}
                    <div className="lg:col-span-1">
                        <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <Lock className="w-6 h-6 text-[#637D37]" />
                                Security
                            </h2>

                            <form onSubmit={handleChangePassword} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#637D37] outline-none"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
                                        >
                                            {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">New Password</label>
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        placeholder="Min 6 characters"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#637D37] outline-none"
                                        required
                                    />
                                    <input
                                        type={showPasswords ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#637D37] outline-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg shadow-gray-200 hover:scale-[1.02] transition-all disabled:opacity-50"
                                >
                                    Update Password
                                </button>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
