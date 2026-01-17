"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Phone, ArrowRight, Loader2, Sparkles, Briefcase, ShoppingBag } from "lucide-react";

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
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
            {/* Abstract background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#637D37]/5 blur-3xl"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#637D37]/3 blur-3xl"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[32px] shadow-2xl shadow-gray-100/50 p-8 sm:p-12">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-[#637D37] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#637D37]/20 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-3">
                            Start Your Journey
                        </h2>
                        <p className="text-gray-500 font-medium">
                            Create an account to browse or sell
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="p-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="userName"
                                    name="userName"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                    placeholder="Username"
                                    value={formData.userName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative group md:col-span-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all ${formData.role === "Buyer" ? "border-[#637D37] bg-[#637D37]/5 ring-1 ring-[#637D37]" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100"}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Buyer"
                                            checked={formData.role === "Buyer"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-2 rounded-lg ${formData.role === "Buyer" ? "bg-[#637D37] text-white" : "bg-gray-200 text-gray-500"}`}>
                                            <ShoppingBag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">Buyer</div>
                                            <div className="text-xs text-gray-500">I want to purchase</div>
                                        </div>
                                    </label>

                                    <label className={`cursor-pointer border rounded-xl p-4 flex items-center gap-3 transition-all ${formData.role === "Seller" ? "border-[#637D37] bg-[#637D37]/5 ring-1 ring-[#637D37]" : "border-gray-100 bg-gray-50/50 hover:bg-gray-100"}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Seller"
                                            checked={formData.role === "Seller"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <div className={`p-2 rounded-lg ${formData.role === "Seller" ? "bg-[#637D37] text-white" : "bg-gray-200 text-gray-500"}`}>
                                            <Briefcase className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">Seller</div>
                                            <div className="text-xs text-gray-500">I want to sell</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="relative group md:col-span-2">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                    placeholder="Phone Number (Required for Seller verification)"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#637D37] transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] transition-all font-medium"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-[#637D37] hover:bg-[#52682d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#637D37] shadow-xl shadow-[#637D37]/20 transform hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-6 h-6" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-bold text-[#637D37] hover:text-[#4d612b] transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
