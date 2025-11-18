import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    food: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "food",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

},
    { timestamps: true })

const likeModel = mongoose.model("like", likeSchema)

export default likeModel