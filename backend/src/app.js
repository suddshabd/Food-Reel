//create server 
import express from "express"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import foodRouter from "./routes/food.routes.js";
import cors from "cors"
import foodPartnerRouter from "./routes/foodpartner.routes.js";
const app = express();

const allowedOrigins = [
    process.env.CORS_ORIGIN || "http://localhost:5173",
    "http://127.0.0.1:5173"]
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("hello world")
})
app.use('/api/auth', authRouter)
app.use('/api/food', foodRouter)
app.use('/api/foodpartner', foodPartnerRouter)
export default app; 
