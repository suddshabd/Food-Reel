import express from "express"
import getFoodPartnerById from "../controllers/foodpartner.controller.js";
import { authFoodPartnerMiddleware } from "../middleware/auth.middleware.js";

const foodPartnerRouter = express.Router();

/*/api/foodpartner by id*/
foodPartnerRouter.get("/:id", authFoodPartnerMiddleware, getFoodPartnerById)
export default foodPartnerRouter