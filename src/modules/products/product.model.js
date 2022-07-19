import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const ProductSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  media: {
    imageurl: [
      {
        type: String,
      },
    ],
    videourl: [
      {
        type: String,
      },
    ],
  },
  tags: [
    {
      type: String,
      required: true,
    },
  ],
});

ProductSchema.index({ shopId: 1, title: 1 }, { unique: true });

ProductSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});

ProductSchema.methods = {
  toJSON() {
    return {
      _id: this.id,
      title: this.title,
      price: this.price,
      description: this.description,
      categoryId: this.categoryId,
      shopId: this.shopId,
      quantity: this.quantity,
      url: this.media,
    };
  },
  addMediaUrl(imageurl, videourl) {
    Array.from(imageurl).forEach((image) => {
      this.media.imageurl.push(image);
    });
    Array.from(videourl).forEach((video) => {
      this.media.videourl.push(video);
    });
  },

  addTags(tags) {
    Array.from(tags).forEach((tag) => {
      this.tags.push(tag);
    });
  },

  updateMediaAndTags(imageurl, videourl, tags) {
    Array.from(this.media.imageurl).forEach((image) => {
      this.media.imageurl.pull(image);
    });
    Array.from(this.media.videourl).forEach((video) => {
      this.media.videourl.pull(video);
    });
    Array.from(this.tags).forEach((tag) => {
      this.tags.pull(tag);
    });
    this.addMediaUrl(imageurl, videourl);
    this.addTags(tags);
  },
};

ProductSchema.statics = {
  createProduct(body, query) {
    const product = this.create({
      title: body.title,
      price: body.price,
      description: body.description,
      shopId: query.shopId,
      categoryId: query.categoryId,
      quantity: body.quantity,
    });
    return product;
  },
};

module.exports = mongoose.model("Product", ProductSchema);
