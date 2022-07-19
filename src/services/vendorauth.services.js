import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import Vendor from "../modules/vendors/vendor.model";
import constants from "../config/constants";

// Local Vendor strategy
const vendorOpts = {
  usernameField: "email",
};

const vendorStrategy = new LocalStrategy(
  vendorOpts,
  async (email, password, done) => {
    console.log("This is vendor strategy");
    try {
      const user = await Vendor.findOne({ email });
      if (!user) {
        return done(null, false);
      } else if (!user.authenticateUser(password)) {
        return done(null, false);
      }

      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }
);

// Vendor Jwt strategy
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await Vendor.findById(payload._id);

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use("vendor-local", vendorStrategy);
passport.use("vendor-jwt", jwtStrategy);

export const authVendor = passport.authenticate("vendor-local", {
  session: false,
});
export const authVendorJwt = passport.authenticate("vendor-jwt", {
  session: false,
});
