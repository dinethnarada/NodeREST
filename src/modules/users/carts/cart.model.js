import mongoose, { Schema } from "mongoose";

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
      min: [1, "Quantity can not be less then 1."],
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

const CartSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: [true, "user is required"],
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
  },
  items: [ItemSchema],
  subTotal: {
    default: 0,
    type: Number,
  },
});

CartSchema.methods = {
  toJSON() {
    return {
      cartId: this.id,
      customerId: this.customerId,
      items: this.items,
      subTotal: this.subTotal,
    };
  },
};

module.exports = mongoose.model("Cart", CartSchema);
