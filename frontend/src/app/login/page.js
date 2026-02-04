"use client";

import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Sparkles, CheckCircle } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Login failed");
            }

            login(data.user, data.token);

            // Redirect based on role or to home
            const userRole = data.user?.role?.toUpperCase();

            if (userRole === "SELLER") {
                router.push("/seller");
            } else {
                router.push("/");
            }
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
                            Elevate Your <br />
                            <span className="text-[#bfd89b]">Workspace</span>
                        </h1>
                        <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                            Discover a curated collection of premium stationery and accessories designed for professionals.
                        </p>

                        <div className="mt-12 flex h-20">
                            {/* Simple Testimonial or Stat */}
                            <div className="border-l-2 border-white/20 pl-6">
                                <div className="flex text-yellow-500 mb-2">
                                    {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-4 h-4 fill-current mr-1" />)}
                                </div>
                                <p className="italic text-gray-400">"The quality is unmatched. Truly verified stuff."</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="mb-10">
                            <Link href="/" className="inline-block text-2xl font-bold font-heading mb-12 tracking-tight">
                                Study<span className="text-[#637D37]">Stuff</span>
                            </Link>

                            <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-500 text-lg">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 text-sm font-medium text-red-600 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 animate-pulse">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
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
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] focus:bg-white transition-all font-medium"
                                            placeholder="Enter your email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            autoComplete="current-password"
                                            required
                                            className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#637D37]/20 focus:border-[#637D37] focus:bg-white transition-all font-medium"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#637D37] focus:ring-[#637D37] border-gray-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                                        Keep me signed in
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-bold text-[#637D37] hover:text-[#4d612b] transition-colors">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-black hover:bg-[#637D37] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#637D37] transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-6 h-6" />
                                ) : (
                                    <>
                                        Sign In
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="font-bold text-[#637D37] hover:text-[#4d612b] transition-colors underline decoration-2 decoration-transparent hover:decoration-[#637D37]"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
