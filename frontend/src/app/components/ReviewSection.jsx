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
        <div className="mt-24 pt-16 border-t border-gray-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-light text-gray-900 mb-2">
                        Customer Reviews
                    </h2>
                    <p className="text-gray-500 font-light">Verified buyer feedback</p>
                </div>

                {user && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-6 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Write a Review
                    </button>
                )}
            </div>

            {/* Summary Section */}
            {
                !loading && reviews.length > 0 && (
                    <div className="bg-gray-50 p-8 md:p-12 mb-12 flex flex-col lg:flex-row gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <div className="text-7xl font-light text-gray-900 mb-3">
                                {(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}
                            </div>
                            <div className="flex gap-1 justify-center lg:justify-start mb-3">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className={`w-5 h-5 ${(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                            </div>
                            <p className="text-gray-500 font-light text-sm">{reviews.length} Verified Reviews</p>
                        </div>

                        <div className="flex-1 w-full max-w-md space-y-3">
                            {[5, 4, 3, 2, 1].map(star => {
                                const count = reviews.filter(r => r.rating === star).length
                                const percentage = (count / reviews.length) * 100
                                return (
                                    <div key={star} className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 w-12 flex-shrink-0">
                                            <span className="font-light text-gray-600">{star}</span>
                                            <Star className="w-3 h-3 text-gray-400" />
                                        </div>
                                        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gray-900 rounded-full transition-all duration-1000"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="w-12 text-sm text-gray-500 font-light text-right">{percentage.toFixed(0)}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }

            {
                message && (
                    <div className={`mb-8 p-4 font-light text-sm ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {message}
                    </div>
                )
            }

            {
                showForm && (
                    <div className="mb-12 bg-gray-50 p-8 md:p-12">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-light text-gray-900">Share Your Experience</h3>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
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
                                <label className="block text-sm font-medium text-gray-700 mb-3">Review Title</label>
                                <input
                                    type="text"
                                    placeholder="Summarize your experience"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors font-light"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">Detailed Review</label>
                                <textarea
                                    placeholder="What did you like or dislike? How was the quality?"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 focus:border-gray-400 focus:outline-none transition-colors font-light min-h-[150px]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-10 py-3 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                            >
                                {submitting ? <Loader2 className="animate-spin mx-auto w-5 h-5" /> : "Post Review"}
                            </button>
                        </form>
                    </div>
                )
            }

            {
                loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-white p-8 border border-gray-200 hover:border-gray-300 transition-colors">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                            {review.user.profilePicture ? (
                                                <img src={review.user.profilePicture} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <User className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{review.user.userName}</div>
                                            <div className="text-xs text-gray-400 font-light mt-1">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star
                                                key={star}
                                                className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <h3 className="font-medium text-gray-900 mb-3">{review.title}</h3>
                                <p className="text-gray-600 font-light leading-relaxed mb-6">{review.comment}</p>

                                <div className="flex items-center gap-6 border-t border-gray-100 pt-6">
                                    <button
                                        onClick={() => handleHelpful(review.id)}
                                        className="flex items-center gap-2 text-sm font-light text-gray-500 hover:text-gray-900 transition-colors"
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        Helpful ({review.helpful})
                                    </button>
                                    {review.verified && (
                                        <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1">Verified Purchase</span>
                                    )}
                                    {user && user.id === review.userId && (
                                        <button
                                            onClick={() => handleDeleteReview(review.id)}
                                            className="ml-auto flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-light transition-colors"
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
                    <div className="text-center py-20 border border-dashed border-gray-200">
                        <p className="text-gray-500 font-light">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                )
            }
        </div >
    )
}
