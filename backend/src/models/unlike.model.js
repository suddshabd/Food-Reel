import mongoose from "mongoose";

const unlikeSchema = new mongoose.Schema({
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

const unlikeModel = mongoose.model("unlike", unlikeSchema)

export default unlikeModel