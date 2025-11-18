import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    foodPartner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "foodPartner"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    saveCount: {
        type: Number,
        default: 0
    },
    isSaved: {
        type: Boolean,
        default: false
    },
    isliked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const foodModel = mongoose.model("food", foodSchema)

export default foodModel