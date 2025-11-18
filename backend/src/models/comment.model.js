import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
    comment: {
        type: String
    }

},
    { timestamps: true })

const commentModel = mongoose.model("comment", commentSchema)

export default commentModel