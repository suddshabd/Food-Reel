import mongoose from "mongoose";

const saveSchema = new mongoose.Schema({
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

const saveModel = mongoose.model("save", saveSchema)

export default saveModel