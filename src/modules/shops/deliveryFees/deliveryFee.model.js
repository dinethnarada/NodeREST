import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const DeliveryFeeSchema = new Schema({
  city: {
    type: String,
    required: [true, "City name is required!"],
  },
  fee:{
    type: Number,
    required : [true, "Fee is required!"],
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
});

DeliveryFeeSchema.index({shopId: 1, city: 1}, {unique:true})

DeliveryFeeSchema.plugin(uniqueValidator, {
  message: "{VALUE} delivery fee for this city by the given shop has already been added"
})

DeliveryFeeSchema.methods = {
  toJSON(){
    return{
      _id: this.id,
      city: this.city,
      fee: this.fee,
      shopId: this.shopId,
    };
  },
};

DeliveryFeeSchema.statics = {
  createDeliveryFee(args, shopId){
    return this.create({
      ...args,
      shopId,
    });
  },
};

module.exports = mongoose.model("DeliveryFee", DeliveryFeeSchema);
