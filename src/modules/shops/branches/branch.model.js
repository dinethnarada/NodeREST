import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const BranchSchema = new Schema({
  branchName: {
    type: String,
    required: [true, "Requied Field!"],
  },
  branchAddress: {
    type: String,
    required: [true, "Requied Field!"],
    unique: true,
  },
  city: {
    type: String,
    required: [true, "Requied Field!"],
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
});

BranchSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});

BranchSchema.methods = {
  toJSON() {
    return {
      _id: this.id,
      branchName: this.branchName,
      branchAddress: this.branchAddress,
      city: this.city,
    };
  },
};

BranchSchema.statics = {
  createBranch(args, shopId) {
    return this.create({
      ...args,
      shopId,
    });
  },
};

module.exports = mongoose.model("Branch", BranchSchema);
