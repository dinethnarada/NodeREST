import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const OperatingHoursSchema = new Schema({
  monday: {
    type: String,
    default: "Closed",
  },
  tuesday: {
    type: String,
    default: "Closed",
  },
  wednesday: {
    type: String,
    default: "Closed",
  },
  thursday: {
    type: String,
    default: "Closed",
  },
  friday: {
    type: String,
    default: "Closed",
  },
  saturday: {
    type: String,
    default: "Closed",
  },
  sunday: {
    type: String,
    default: "Closed",
  },
  shopId: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
    unique: true,
  },
});

OperatingHoursSchema.plugin(uniqueValidator, {
  message: "{VALUE} Operating hours for this shop have already been assigned"
})

OperatingHoursSchema.methods = {
  toJSON(){
    return{
      _id: this.id,
      monday: this.monday,
      tuesday: this.tuesday,
      wednesday: this.wednesday,
      thursday: this.thursday,
      friday: this.friday,
      saturday: this.saturday,
      sunday: this.sunday,
      shopId: this.shopId,
    };
  },
};

OperatingHoursSchema.statics = {
  createOperatingHours(args, shopId){
    return this.create({
      ...args,
      shopId,
    });
  },
};

module.exports = mongoose.model("OperatingHours", OperatingHoursSchema);
