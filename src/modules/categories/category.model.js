import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import _ from "underscore";

const CategorySchema = new Schema({
  shopId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

CategorySchema.index({ shopId: 1, category: 1 }, { unique: true });

CategorySchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});
// CategorySchema.pre("save", function (next) {
//   this.categories = _.uniq(this.categories);
//   next();
// });

CategorySchema.methods = {
  // addCategory(name) {
  //   this.categories.push(name);
  //   this.save();
  // },
  // removeCategory(name) {
  //   this.categories.pull(name);
  //   this.save();
  // },
  toJSON() {
    return {
      categoryId: this._id,
      shopId: this.shopId,
      category: this.category,
    };
  },
};

//module.exports = mongoose.model("Category", CategorySchema);
