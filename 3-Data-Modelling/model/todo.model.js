import mongoose from "mongoose";

const TodoScheema = new mongoose.Schema({
todoContent:{
  type: String,
  require: true
},
complete:{
  type: Boolean,
  default: false
},
createdBy:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
},
subTodo:[
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTodo'
  }
]
}, {timestamps: true})

export const TODO = mongoose.model('TODO', TodoScheema)