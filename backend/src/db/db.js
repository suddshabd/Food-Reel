import mongoose from "mongoose"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
        // console.log(`\n MONGODB Connected !! DB Host: ${connectionInstance.connection.host}`);
        // console.log(process.env.MONGODB_URL)
    } catch (error) {
        console.log("Mongodb connection error", error);
        process.exit(1)
    }

}
export default connectDB