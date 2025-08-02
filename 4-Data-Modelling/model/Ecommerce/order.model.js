import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
  productId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity:{
   type: Number,
   require: true
  }
})

const orderSchema = new mongoose.Schema({
orderPrice:{
  type: Number,
  require: true
},
customer:{
  type: mongoose.Schema.Types.ObjectId,
  ref:'User'
},
orderItems:{
  type: [orderItemsSchema]
},
address:{
  type: String,
  require: true
},
status:{
  type: String,
  require: true,
  default: 'Order Placed'
}
}, {timestamps: true})

export const OrderItem = mongoose.model('OrderItem', orderSchema) 