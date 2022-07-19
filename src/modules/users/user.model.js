import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { passwordReg } from "./user.validator";
import { hashSync, compareSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";

import constants from "../../config/constants";

const UserSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["local", "google", "facebook"],
      required: true,
    },
    local: {
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
    facebook: {
      id: {
        type: String,
      },
      email: {
        type: String,
        trim: true,
        validate: {
          validator(email) {
            return validator.isEmail(email);
          },
          message: "{VALUE} is not a valid email",
        },
      },
    },
    google: {
      id: {
        type: String,
      },
      email: {
        type: String,
        trim: true,
        validate: {
          validator(email) {
            return validator.isEmail(email);
          },
          message: "{VALUE} is not a valid email",
        },
      },
    },
    address: {
      type: String,
      //required: [true, "address is required!"],
    },
    mobileNumber: {
      type: Number,
      //required: [true, "mobileNumber is required!"],
      minlength: [7, "Mobile Number needs to be 7 digits long"],
    },
    username: {
      type: String,
      required: [true, "Username is required!"],
      trim: true,
    },
  },
  { timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
  message: "{VALUE} already taken!",
});

UserSchema.pre("save", function (next) {
  if (this.isModified("local.password") || this.method == "local") {
    this.local.password = this._hashPassword(this.local.password);
  }
  next();
});

UserSchema.methods = {
  _hashPassword(password) {
    return hashSync(password);
  },
  authenticateUser(password) {
    return compareSync(password, this.local.password);
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
      status: true,
      username: this.username,
      token: this.createToken(),
    };
  },
  toJSON() {
    return {
      _id: this.id,
      username: this.username,
      mobileNumber: this.mobileNumber,
      address: this.address,
      username: this.username,
    };
  },
};

module.exports = mongoose.model("User", UserSchema);
