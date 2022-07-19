import mongoose, { Schema } from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

const OrderProductSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref:"Order",
    required: [true, "orderId is required"],
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "productId is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
});

OrderProductSchema.methods = {
  toJSON(){
    return{
      _id: this.id,
      quantity: this.quantity,
      orderId: this.orderId,
      productId: this.productId,
    };
  },
};

OrderProductSchema.statics = {
  createOrderProduct(args, orderId, productId){
    return this.create({
      ...args,
      orderId,
      productId
    });
  },
};

module.exports = mongoose.model("OrderProduct", OrderProductSchema);


