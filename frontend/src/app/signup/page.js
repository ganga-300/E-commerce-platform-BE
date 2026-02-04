"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Sparkles, Briefcase, ShoppingBag, Check } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Signup() {
    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Buyer",
        phoneNumber: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: formData.userName,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role.toUpperCase(),
                    phoneNumber: formData.phoneNumber,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Signup failed");
            }

            // Backend does not return token on register, so redirect to login
            router.push("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Column - Hero Image */}
            <div className="hidden lg:flex w-1/2 relative bg-gray-900 text-white overflow-hidden">
                <Image
                    src="/classic-study-room-colour-of-cream-and-white.jpg"
                    alt="Premium Workspace"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="relative z-10 w-full p-20 flex flex-col justify-end h-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold font-heading mb-6 leading-tight">
                            Start Your <br />
                            <span className="text-[#bfd89b]">Journey</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                            Join our community of professionals and creators. Experience the finest stationery.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-y-auto">
                <div className="w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-10">
                            <Link href="/" className="inline-block text-2xl font-bold font-heading mb-8 tracking-tight">
                                Study<span className="text-[#637D37]">Stuff</span>
                            </Link>
                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-500 text-lg">
                                Enter your details to get started.
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Username</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="userName"
                                            name="userName"
                                            type="text"
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                            placeholder="John Doe"
                                            value={formData.userName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">I want to...</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all relative overflow-hidden ${formData.role === "Buyer" ? "border-[#637D37] bg-[#637D37]/5 ring-1 ring-[#637D37]" : "border-gray-200 hover:bg-gray-50"}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="Buyer"
                                                checked={formData.role === "Buyer"}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className={`p-2 rounded-lg ${formData.role === "Buyer" ? "bg-[#637D37] text-white shadow-lg shadow-[#637D37]/30" : "bg-gray-100 text-gray-500"}`}>
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Buy</div>
                                                <div className="text-xs text-gray-500">Shop products</div>
                                            </div>
                                            {formData.role === "Buyer" && (
                                                <div className="absolute top-2 right-2 text-[#637D37]">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </label>

                                        <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all relative overflow-hidden ${formData.role === "Seller" ? "border-[#637D37] bg-[#637D37]/5 ring-1 ring-[#637D37]" : "border-gray-200 hover:bg-gray-50"}`}>
                                            <input
                                                type="radio"
                                                name="role"
                                                value="Seller"
                                                checked={formData.role === "Seller"}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <div className={`p-2 rounded-lg ${formData.role === "Seller" ? "bg-[#637D37] text-white shadow-lg shadow-[#637D37]/30" : "bg-gray-100 text-gray-500"}`}>
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">Sell</div>
                                                <div className="text-xs text-gray-500">List Items</div>
                                            </div>
                                            {formData.role === "Seller" && (
                                                <div className="absolute top-2 right-2 text-[#637D37]">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            type="tel"
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                            placeholder="+91 98765 43210"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-black hover:bg-[#637D37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#637D37] transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg mt-6"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-6 h-6" />
                                ) : (
                                    <>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center pb-8 lg:pb-0">
                            <p className="text-gray-500">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="font-bold text-[#637D37] hover:text-[#4d612b] transition-colors underline decoration-2 decoration-transparent hover:decoration-[#637D37]"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
