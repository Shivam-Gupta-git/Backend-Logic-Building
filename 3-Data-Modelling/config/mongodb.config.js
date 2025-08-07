import mongoose from "mongoose";

export const dataBase = async () => {
  try {
    await mongoose.connect(`${process.env.MONGOOSEURL}/DataModelingTodo`)
    console.log('Database connection successfully')
  } catch (error) {
    console.log(`database connection failed ${error}`)
  }
}