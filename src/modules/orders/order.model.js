import  mongoose, { Schema } from 'mongoose';
import uniqueValidator from "mongoose-unique-validator";

//each item in the order
const ItemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    productImage: {
      type: String,
    },
    productName: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity cannot be less then 1."],
    },
    unitPrice: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const OrderSchema = new Schema({
  trackingNumber: {
    type: String,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  //from the list in deliveryFee collection
  deliveryCity: {
    type: String,
    required: [true, "deliveryCity is required"]
  },
  deliveryAddress: {
    type: String,
    required: [true, "deliveryAddress is required"],
  },
  deliveryDate: {
    type: Date,
    required: [true, "deliveryDate is required"],
  },
  //24 hour format E.g "1530" for 3:30PM, "0510" for 5:10AM
  deliveryTime: {
    type: String,
    required: [true, "deliveryTime is required"],
  },
  specialInstructions:{
    type: String,
  },
  orderStatus: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Accepted", "Out for delivery", "Delivered", "Completed"],
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  deliveryNote: {
    type: String,
  },
  storePickup: {
    type: Boolean,
    default: false,
  },
  transactionId:{
    type: String,
    default: null,
  },
  items: [ItemSchema],
  orderTotal: {
    type: Number,
    required: true,
  },
  shopId: {
    type: Schema.Types.ObjectID,
    ref: "Shop",
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectID,
    ref: "User",
    required: true,
  },
});

OrderSchema.methods = {
  toJSON(){
    return{
      _id: this.id,
      items: this.items,
      trackingNumber: this.trackingNumber,
      orderDate: this.orderDate,
      deliveryCity: this.deliveryCity,
      deliveryAddress: this.deliveryAddress,
      deliveryDate: this.deliveryDate,
      deliveryTime: this.deliveryTime,
      specialInstructions: this.specialInstructions,
      orderStatus: this.orderStatus,
      statusUpdatedAt: this.statusUpdatedAt,
      deliveryNote: this.deliveryNote,
      storePickup: this.storePickup,
      orderTotal: this.orderTotal,
      transactionId: this.transactionId,
      shopId: this.shopId,
      customerId: this.customerId,
    };
  },
};

OrderSchema.statics = {
  createOrder(args, items, orderTotal, shopId, customerId){
    return this.create({
      ...args,
      items,
      orderTotal,
      shopId,
      customerId,
    });
  },
};

module.exports = mongoose.model("Order", OrderSchema);
