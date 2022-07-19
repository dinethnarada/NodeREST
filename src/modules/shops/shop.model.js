import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

import Vendor from "../vendors/vendor.model";

const ShopSchema = new Schema({
  businessName: {
    type: String,
    required: [true, "Required Field"],
  },
  address: {
    type: String,
    required: [true, "Required Field"],
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  industry: {
    type: String,
    required: [true, "Required Field"],
  },
  businessSize: {
    type: String,
    required: [true, "Required Field"],
  },
  businessRegNo: {
    type: Number,
  },
});

ShopSchema.methods = {
  // addProduct(prodId) {
  //   this.products.push(prodId);
  //   this.save();
  // },
  // removeProduct(prodId) {
  //   this.products.pull(prodId);
  //   this.save();
  // },
  toJSON() {
    return {
      _id: this.id,
      businessName: this.businessName,
      address: this.address,
      industry: this.industry,
    };
  },
};

ShopSchema.statics = {
  list({ skip = 0, limit = 5 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("vendor");
  },
};

module.exports = mongoose.model("Shop", ShopSchema);
