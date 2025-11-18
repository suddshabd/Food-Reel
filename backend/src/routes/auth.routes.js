import express from "express"
import { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner } from "../controllers/auth.controller.js";
const authRouter = express.Router();

authRouter.post('/user/register', registerUser)
authRouter.post('/user/login', loginUser)
authRouter.get('/user/logout', logoutUser)

authRouter.post('/foodpartner/register', registerFoodPartner)
authRouter.post('/foodpartner/login', loginFoodPartner)
authRouter.get('/foodpartner/logout', logoutFoodPartner)
export default authRouter