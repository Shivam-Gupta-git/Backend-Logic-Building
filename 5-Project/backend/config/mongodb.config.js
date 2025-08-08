import mongoose from 'mongoose'

 const connectDB = async () => {
  try {
    const connectionDB = await mongoose.connect(`${process.env.MONGODB_URL}/Project`)
    console.log(`database connection successfully : ${connectionDB.connection.host}`)
  } catch (error) {
    console.log('database connection failed', error)
    process.exit(1)
  }
}
export default connectDB