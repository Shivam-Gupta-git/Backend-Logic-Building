import mongoose from "mongoose";

const hospitaSchema = new mongoose.Schema({
name: {
  type: String,
  require: true,
},
address: {
  type: String,
  require: true
}, 
city: {
  type: String,
  require: true
}, 
state: {
  type: String,
  require: true
}, 
pinCode: {
  type: String,
  require: true
},
specializedIn: [
  {
    type: String
  }
]

}, {timestamps: true})

export const Hospital = mongoose.model("Hospital", hospitaSchema)