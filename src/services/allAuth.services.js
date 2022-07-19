import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

import Vendor from "../modules/vendors/vendor.model";
import User from "../modules/users/user.model";
import constants from "../config/constants";

// Local Jwt strategy
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  console.log(payload, jwtOpts);
  try {
    const user = await User.findById(payload._id);
    if (!user) {
      const vendor = await Vendor.findById(payload._id);
      if (!vendor) {
        return done(null, false);
      }
      return done(null, vendor);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use("both-jwt", jwtStrategy);

export const allJwt = passport.authenticate("both-jwt", {
  session: false,
});
