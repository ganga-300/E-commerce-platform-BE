"use client"

import { useState, useEffect } from "react"
import { Star, MessageSquare, ThumbsUp, Loader2, User, Trash2 } from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function ReviewSection({ productId }) {
    const { user, token } = useAuth()
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (productId) {
            fetchReviews()
        }
    }, [productId])

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reviews/product/${productId}`)
            if (!res.ok) throw new Error("Failed to load reviews")
            const data = await res.json()
            setReviews(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setMessage("")

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ productId, rating, title, comment })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit review")
            }

            setMessage("Review submitted successfully!")
            setShowForm(false)
            fetchReviews()
            setTitle("")
            setComment("")
            setRating(5)
        } catch (err) {
            setMessage(`Error: ${err.message}`)
        } finally {
            setSubmitting(false)
        }
    }

    const handleHelpful = async (reviewId) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reviews/${reviewId}/helpful`, {
                method: "POST"
            })
            if (res.ok) {
                // Update local state to reflect helpful vote
                setReviews(reviews.map(r =>
                    r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r
                ))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteReview = async (reviewId) => {
        if (!confirm("Are you sure you want to delete your review?")) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.message || "Failed to delete review")
            }

            setMessage("Review deleted successfully")
            fetchReviews()
        } catch (err) {
            setMessage(`Error: ${err.message}`)
        }
    }

    return (
        <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-[#637D37]" />
                        Customer Reviews
                    </h2>
                    <p className="text-gray-500">Real feedback from verified buyers.</p>
                </div>

                {user && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-[#637D37] text-white rounded-xl font-bold shadow-lg shadow-[#637D37]/20 hover:scale-105 transition-transform"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Summary Section */}
            {
                !loading && reviews.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-100 flex flex-col lg:flex-row gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="text-6xl font-black text-gray-900 mb-2">
                                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                            </div>
                            <div className="flex gap-1 justify-center lg:justify-start mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className={`w-5 h-5 ${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-500 font-medium">{reviews.length} Verified Reviews</p>
                        </div>

                        <div className="flex-1 w-full max-w-lg space-y-3">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = reviews.filter(r => r.rating === star).length
                                const percentage = (count / reviews.length) * 100
                                return (
                                    <div key={star} className="flex items-center gap-4">
                                        <div className="flex items-center gap-1 w-12 flex-shrink-0">
                                            <span className="font-bold text-gray-700">{star}</span>
                                            <Star className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#637D37] rounded-full transition-all duration-1000"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-10 text-sm text-gray-500 font-medium text-right">{percentage.toFixed(0)}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }

            {
                message && (
                    <div className={`mb-6 p-4 rounded-xl font-medium ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
                        {message}
                    </div>
                )
            }

            {
                showForm && (
                    <div className="mb-12 bg-gray-50 rounded-2xl p-8 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Share Your Experience</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">Cancel</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star
                                            key={star}
                                            className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                                            onClick={() => setRating(star)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Review Title</label>
                                <input
                                    type="text"
                                    placeholder="Summarize your experience"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#637D37] focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Detailed Review</label>
                                <textarea
                                    placeholder="What did you like or dislike? How was the quality?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#637D37] focus:border-transparent min-h-[150px]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full md:w-auto px-10 py-4 bg-[#637D37] text-white rounded-xl font-bold shadow-lg shadow-[#637D37]/20 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="animate-spin mx-auto w-6 h-6" /> : "Post Review"}
                            </button>
                        </form>
                    </div>
                )
            }

            {
                loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-[#637D37] w-12 h-12" />
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#637D37]/10 rounded-full flex items-center justify-center">
                                            {review.user.profilePicture ? (
                                                <img src={review.user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-[#637D37]" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{review.user.userName}</div>
                                            <div className="text-xs text-gray-400 font-medium">Verified Buyer • {new Date(review.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <h3 className="font-bold text-gray-900 mb-2">{review.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{review.comment}"</p>

                                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                                    <button
                                        onClick={() => handleHelpful(review.id)}
                                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#637D37] transition-colors"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        Helpful ({review.helpful})
                                    </button>
                                    {review.verified && (
                                        <span className="text-[10px] uppercase font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Verified</span>
                                    )}
                                    {user && user.id === review.userId && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-700 text-xs font-bold transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                )
            }
        </div >
    )
}
