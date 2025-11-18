import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Helper component to display stars based on the rating
const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(fullStars)].map((_, i) => (
                <span key={`full-${i}`} className="text-yellow-400 text-lg">★</span>
            ))}
            {hasHalfStar && <span className="text-yellow-400 text-lg">½</span>}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={`empty-${i}`} className="text-gray-400 text-lg">★</span>
            ))}
            <span className="ml-1 text-sm font-semibold">({rating})</span>
        </div>
    );
};

// Reusable feed for vertical reels
const ReelFeed = ({ items = [], onLike, onComment, onSave, emptyMessage = 'No videos yet.' }) => {
    const videoRefs = useRef(new Map());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (!(video instanceof HTMLVideoElement)) return;
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        video.play().catch(() => { /* ignore autoplay errors */ });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.6 }
        );

        const currentRefs = videoRefs.current;
        currentRefs.forEach((vid) => observer.observe(vid));

        return () => {
            currentRefs.forEach((vid) => observer.unobserve(vid));
            observer.disconnect();
        };
    }, [items]);

    const setVideoRef = (id) => (el) => {
        if (!el) {
            videoRefs.current.delete(id);
        } else {
            videoRefs.current.set(id, el);
        }
    };

    if (items.length === 0) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-black text-white">
                <p className="text-xl">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black">
            {items.map((item) => (
                <div key={item._id} className="h-screen w-screen relative flex flex-col justify-end snap-start">
                    <video
                        ref={setVideoRef(item._id)}
                        className="absolute top-0 left-0 w-full h-full object-cover z-0"
                        src={item.video}
                        muted
                        playsInline
                        loop
                        preload="metadata"
                    />

                    <div className="relative z-10 flex justify-between items-end p-4 pb-8">
                        {/* LEFT SIDE: Description and Partner Info */}
                        <div className="flex flex-col text-white max-w-[60%]">
                            <div className="mb-2">
                                <h3 className="text-3xl font-extrabold mb-1">{item.name}</h3>
                                <StarRating rating={item.rating || 4.5} />
                            </div>
                            <p className="text-lg mb-4 leading-snug overflow-hidden line-clamp-2">{item.description}</p>
                            {item.foodPartner && (
                                <Link className="inline-block w-full sm:w-auto py-2 px-4 bg-red-600 text-white font-bold rounded-xl shadow-lg text-center text-sm hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]" to={"/foodpartner/" + item.foodPartner}>
                                    Visit Store
                                </Link>
                            )}
                        </div>

                        {/* RIGHT SIDE: Interaction Bar */}
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col items-center">
                                <button onClick={onLike ? () => onLike(item) : undefined} className="flex flex-col items-center justify-center p-3 text-white transition-transform duration-200 active:scale-90" aria-label="Like">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill={item.isLiked ? '#ef4444' : 'none'} stroke={item.isLiked ? '#ef4444' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                    </svg>
                                </button>
                                <div className="text-xs font-semibold text-white -mt-2">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <button onClick={() => onComment(item._id)} className="flex flex-col items-center justify-center p-3 text-white transition-transform duration-200 active:scale-90" aria-label="Comment">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white"><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" /></svg>
                                </button>
                                <div className="text-xs font-semibold text-white mt-1">{item.comments}</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <button onClick={() => onSave(item)} className="flex flex-col items-center justify-center p-3 text-white transition-transform duration-200 active:scale-90" aria-label="Save">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className={`w-8 h-8 ${item.isSaved ? 'text-pink-500' : 'text-white'}`}><path d={item.isSaved ? "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" : "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18-5 2.18V5h10v13z"} /></svg>
                                </button>
                                <span className="text-xs font-semibold text-white mt-1">Save</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReelFeed;