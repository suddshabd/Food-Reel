import express from "express"
import { getFoodItems, likeFood, createComment, saveFood, unlikeFood, getSavedFoodItems } from "../controllers/food.controller.js";
import { authFoodPartnerMiddleware, authUserMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer";
import { createFood, } from "../controllers/food.controller.js";
const foodRouter = express.Router();
import { uploadFile } from "../services/storage.service.js";





const storage = multer.memoryStorage();
const upload = multer({ storage });


// post api /food [protected]
foodRouter.post("/", authFoodPartnerMiddleware,
    upload.single("video"),
    createFood)

//get /api/food for users [protected]

foodRouter.get("/", authUserMiddleware, getFoodItems)
foodRouter.get("/saved", authUserMiddleware, getSavedFoodItems)



foodRouter.post("/like", authUserMiddleware, likeFood)
foodRouter.post("/unlike", authUserMiddleware, unlikeFood)
foodRouter.post("/comment", authUserMiddleware, createComment)
foodRouter.post("/save", authUserMiddleware, saveFood)
export default foodRouter
