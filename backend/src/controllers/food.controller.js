import foodModel from '../models/food.model.js';
import uploadFile from "../services/storage.service.js";
import { v4 as uuidv4 } from 'uuid';
import likeModel from '../models/likes.model.js';
import commentModel from '../models/comment.model.js';
import saveModel from '../models/save.model.js';
import unlikeModel from '../models/unlike.model.js';

export const createFood = async (req, res) => {

    try {
        console.log(req.body);
        console.log(req.file);

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Upload file
        const uploaded = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            uuidv4()
        );

        if (!uploaded || !uploaded.url) {
            return res.status(500).json({
                message: "Upload failed",
                error: "No URL returned from storage service"
            });
        }

        // Create food item
        const foodItem = await foodModel.create({
            name: req.body.name,
            description: req.body.description,
            video: uploaded.url,   // FIXED HERE
            foodPartner: req.foodPartner._id
        });

        return res.status(201).json({
            message: "Food item created successfully",
            food: foodItem
        });

    } catch (error) {
        return res.status(500).json({
            message: "Upload failed",
            error: error.message,
        });
    }
};

export const getFoodItems = async (req, res) => {

    try {
        const userId = req.user ? req.user._id : null;

        // Using .lean() is more performant as it returns plain JavaScript objects
        const foodItems = await foodModel.find({}).lean();

        if (userId) {
            // Fetch user's likes and saves in parallel for better performance
            const [userLikes, userSaves] = await Promise.all([
                likeModel.find({ user: userId }).select('food').lean(),
                saveModel.find({ user: userId }).select('food').lean()
            ]);

            // Create Sets for quick lookups (O(1) complexity)
            const likedFoodIds = new Set(userLikes.map(like => like.food.toString()));
            const savedFoodIds = new Set(userSaves.map(save => save.food.toString()));

            // Add 'isLiked' and 'isSaved' properties to each food item
            foodItems.forEach(item => {
                item.isLiked = likedFoodIds.has(item._id.toString());
                item.isSaved = savedFoodIds.has(item._id.toString());
            });
        } else {
            // If no user is logged in, all items are not liked or saved
            foodItems.forEach(item => {
                item.isLiked = false;
                item.isSaved = false;
            });
        }

        res.status(200).json({
            message: "Food Items Fetched Successfully",
            foodItems
        })
    }
    catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ message: "Error fetching food items", error: error.message });
    }
}

export const likeFood = async (req, res) => {
    const { foodId } = req.body;
    const user = req.user;
    const isAlreadyLiked =
        await likeModel.findOne({
            user: user._id,
            food: foodId
        })
    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(
            foodId,
            {
                $inc: { likeCount: -1 }
            },

        )
        return res.status(200).json({
            message: "Food Unliked Successfully"
        })
    }
    const like = await likeModel.create({
        user: user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(
        foodId,
        {
            $inc: { likeCount: 1 }
        },

    )
    res.status(200).json({
        message: "Food Liked Successfully",
        like
    })
}
export const createComment = async (req, res) => {
    const { foodId } = req.body;
    const user = req.user;
    const comment = await commentModel.findByIdAndUpdate(
        foodId,
        {
            $push: { comments: { user: user._id, body } }
        },
        {
            new: true
        }
    )
    res.status(200).json({
        message: "Comment Created Successfully",
        comment
    })
}
export const saveFood = async (req, res) => {
    const { foodId } = req.body;
    const user = req.user;
    const isAlreadySaved =
        await saveModel.findOne({
            user: user._id,
            food: foodId
        })
    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(
            foodId,
            {
                $inc: { saveCount: -1 }
            },
        )
        return res.status(200).json({
            message: "Food Unsaved Successfully"
        })
    }
    const save = await saveModel.create({
        user: user._id,
        food: foodId,
    })

    await foodModel.findByIdAndUpdate(
        foodId,
        {
            $inc: { saveCount: 1 }
        },
    )
    res.status(200).json({
        message: "Food Saved Successfully",
        save
    })
}

export const unlikeFood = async (req, res) => {
    const { foodId } = req.body;
    const user = req.user;
    const isAlreadyUnliked =
        await unlikeModel.findOne({
            user: user._id,
            food: foodId
        })
    if (isAlreadyUnliked) {
        await unlikeModel.deleteOne({
            user: user._id,
            food: foodId
        })
        return res.status(200).json({
            message: "Food Unliked Successfully"
        })
    }
    const unlike = await unlikeModel.create({
        user: user._id,
        food: foodId
    })
    res.status(200).json({

    })
}

export const getSavedFoodItems = async (req, res) => {
    const user = req.user;
    const savedFoodItems = await saveModel.find({ user: user._id }).populate('food')
    if (!savedFoodItems) {
        return res.status(404).json({
            message: "No Saved Food Items Found"
        })
    }
    res.status(200).json({
        message: "Saved Food Items Fetched Successfully",
        savedFoodItems
    })
}