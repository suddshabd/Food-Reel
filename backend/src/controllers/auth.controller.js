import userModel from "../models/user.model.js";
import foodPartnerModel from "../models/foodpartner.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

//user controllers

async function registerUser(req, res) {
    const { fullName, email, password } = req.body

    const isUserAlreadyExists = await userModel.findOne({
        email

    })
    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }
    const hasedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hasedPassword
    })
    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })
}
async function loginUser(req, res) {
    const { email, password } = req.body
    const user = await userModel.findOne({
        email
    })
    if (!user) {
        return res.status(400).json({
            message: "invalid email or password"
        })
    }
    const isPasswordsValid = await bcrypt.compare(password, user.password);
    if (!isPasswordsValid) {
        return res.status(400).json({
            message: "invalid  password"
        })
    }
    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(201).json({
        message: "User loggedin successfully",
        user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName
        }
    })

}
async function logoutUser(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: "user logged out successfully"
    })
}

//food partner controllers     

async function registerFoodPartner(req, res) {
    const { name, email, password, phone, address, contactName } = req.body;
    const isAccountAlreadyExists = await foodPartnerModel.findOne({
        email
    })

    if (isAccountAlreadyExists) {
        return res.status(400).json({
            message: "Food Partner already exists"
        })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        address,
        contactName,
        phone

    })
    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(201).json({
        message: "Food Partner registered successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name,
            address: foodPartner.address,
            contactName: foodPartner.contactName,
            phone: foodPartner.phone
        }
    })
}
async function loginFoodPartner(req, res) {
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({
        email
    })
    if (!foodPartner) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const isPasswordisValid = await bcrypt.compare(password, foodPartner.password)

    if (!isPasswordisValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }
    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(201).json({
        message: "Food Partner loggedin successfully",
        foodPartner: {
            _id: foodPartner._id,
            email: foodPartner.email,
            name: foodPartner.name
        }
    })
}
async function logoutFoodPartner(req, res) {
    res.clearCookie("token")
    res.status(200).json({
        message: "Food Partner logged out successfully"
    })
}
export {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}