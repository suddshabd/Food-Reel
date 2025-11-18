import app from "./src/app.js";
import dotenv from "dotenv"
import connectDB from "./src/db/db.js";
dotenv.config({
    path: './.env'
})
connectDB();
app.listen(3000, () => {
    console.log("sever is running on port 3000")
    // console.log(process.env.MONGODB_URL)
})