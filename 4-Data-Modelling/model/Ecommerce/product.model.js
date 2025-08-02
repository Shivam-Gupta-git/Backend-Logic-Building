import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    require: true
  },
  description:{
    type: String
  },
  price:{
    type: Number,
    default: 0
  },
  stock:{
   type: Number,
   default: 0
  },
  image:{
    type: Array,
  }, 
  category:{
    type: String,
    require: true
  },
  bestSeller:{
   type: Boolean
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }

}, {timestamps: true})

export const Product = mongoose.model('Product', productSchema)