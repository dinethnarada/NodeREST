import mongoose, { Schema } from "mongoose";

import uniqueValidator from "mongoose-unique-validator";

const RatingSchema = new Schema({
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    unique: true,
  },
  rating: {
    type: Number,
    required: [true, "Rating Required!"],
  },
});

//RatingSchema.index({ shopId: 1, customerId: 1 }, { unique: true });

RatingSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});

RatingSchema.methods = {
  toJSON() {
    return {
      ratingId: this.id,
      orderId: this.orderId,
      rating: this.rating,
    };
  },
};

module.exports = mongoose.model("Rating", RatingSchema);
