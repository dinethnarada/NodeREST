import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { passwordReg } from "../users/user.validator";
import { hashSync, compareSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

import constants from "../../config/constants";

const VendorSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      validate: {
        validator(email) {
          return validator.isEmail(email);
        },
        message: "{VALUE} is not a valid email",
      },
      required: true,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      minlength: [6, "Password need to be longer!"],
      validate: {
        validator(password) {
          return passwordReg.test(password);
        },
        message: "{VALUE} is not a valid password!",
      },
    },
  },
  { timestamps: true }
);

VendorSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});

VendorSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = this._hashPassword(this.password);
  }
  next();
});

VendorSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.password);
  },
  createToken() {
    return jwt.sign(
      {
        _id: this._id,
      },
      constants.JWT_SECRET
    );
  },
  toAuthJSON() {
    return {
      _id: this.id,
      token: this.createToken(),
    };
  },
  toJSON() {
    return {
      _id: this.id,
      email: this.email,
      contactNo: this.contactNo,
    };
  },
};

module.exports = mongoose.model("Vendor", VendorSchema);
