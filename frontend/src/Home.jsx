// import React, { useEffect, useState } from 'react';
// import API from './api'; // Use the centralized API instance
// import ReelFeed from './ReelFeed';

// const Home = () => {
//     const [videos, setVideos] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         setLoading(true);
//         API.get("/food")
//             .then(response => {
//                 // Initialize client-side state from backend data
//                 const initialVideos = response.data.foodItems.map(video => ({
//                     ...video,
//                     isLiked: video.isLiked || false,
//                     isSaved: video.isSaved || false,
//                 }));
//                 setVideos(initialVideos);
//                 setError(null);
//             })
//             .catch((err) => {
//                 console.error("Error fetching videos:", err);
//                 setError("Could not load videos. Please try again later.");
//                 setVideos([]);
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     }, []);

//     async function likeVideo(item) {
//         try {
//             const response = await API.post("/food/like", { foodId: item._id });
//             if (response.data.like) {
//                 console.log("Video liked");
//                 setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount + 1, isLiked: true } : v));
//             } else {
//                 console.log("Video unliked");
//                 setVideos(prev => prev.map(v => v._id === item._id ? { ...v, likeCount: v.likeCount - 1, isLiked: false } : v));
//             }
//         } catch (err) {
//             console.error("Failed to toggle like:", err);
//         }
//     }

//     async function saveVideo(item) {
//         // Optimistic update for a faster UI response
//         setVideos(prev => prev.map(v => v._id === item._id ? { ...v, isSaved: !v.isSaved } : v));
//         // You can add an API call here to sync with the backend
//     }

//     return (
//         <ReelFeed
//             items={videos}
//             onLike={likeVideo}
//             onSave={saveVideo}
//             emptyMessage={loading ? "Loading..." : (error || "No videos available.")}
//         />
//     );
// };

// export default Home;


import React, { useEffect, useState } from 'react'
import axios from 'axios';
import '../../styles/reels.css'
import ReelFeed from '../../components/ReelFeed'

const Home = () => {
    const [videos, setVideos] = useState([])
    // Autoplay behavior is handled inside ReelFeed

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    // Using local refs within ReelFeed; keeping map here for dependency parity if needed

    async function likeVideo(item) {

        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, { withCredentials: true })

        if (response.data.like) {
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        } else {
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }

    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })

        if (response.data.save) {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        } else {
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    )
}

export default Home