import app from "./src/app.js";
import dotenv from "dotenv"
import connectDB from "./src/db/db.js";
dotenv.config({
    path: './.env'
})
connectDB();

const PORT = process.env.PORT || 3000;

// Only start the server if this file is run directly (e.g., `npm run dev`)
// and not when imported by Vercel's serverless function handler.
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'development') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;