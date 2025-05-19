import mongoose from "mongoose"
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
    console.log("MongoDb connected!!")
  } catch (error) {
    console.error("Error in connnecting ot mongoDb", error)
  }  
}
export default connectDB