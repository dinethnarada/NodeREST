import passport from "passport";
import LocalStrategy from "passport-local";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import FacebookTokenStrategy from "passport-facebook-token";
import GooglePlusTokenStrategy from "passport-google-plus-token";

import User from "../modules/users/user.model";
import constants from "../config/constants";

// Local strategy
const localOpts = {
  usernameField: "email",
};

const localStrategy = new LocalStrategy(
  localOpts,
  async (email, password, done) => {
    console.log("This is local strategy");
    try {
      const user = await User.findOne({ "local.email": email });
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

// Local Jwt strategy
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
  try {
    const user = await User.findById(payload._id);

    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

// Facebook Strategy
const passportConfig = {
  clientID: "377704953273264",
  clientSecret: "e8cf303d7b7fc5e4e1735332adda7fa0",
  callbackURL: "http://localhost:3000/api/v1/users/signup-facebook/redirect",
};

const facebookStrategy = new FacebookTokenStrategy(
  passportConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ "facebook.id": profile.id });
      if (!user) {
        const newUser = await User.create({
          method: "facebook",
          facebook: {
            id: profile.id,
            email: profile.emails[0].value,
          },
          username: profile.displayName,
        });
        return done(null, newUser);
      }
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }
);

// Google Plus Strategy
const googleConfig = {
  clientID:
    "286840303359-7e1isibvru2fkmlcbairhqeop74r8nnd.apps.googleusercontent.com",
  clientSecret: "LdYZYLNivz8v_-ry6CSgwseu",
};

const googleStrategy = new GooglePlusTokenStrategy(
  googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ "google.id": profile.id });
      if (!user) {
        const newUser = await User.create({
          method: "google",
          google: {
            id: profile.id,
            email: profile.emails[0].value,
          },
          username: profile.displayName,
        });
        return done(null, newUser);
      }
      return done(null, user);
    } catch (e) {
      return done(e, false);
    }
  }
);

passport.use(localStrategy);
passport.use("jwt", jwtStrategy);
passport.use(facebookStrategy);
passport.use(googleStrategy);

export const authLocal = passport.authenticate("local", { session: false });
export const authJwt = passport.authenticate("jwt", { session: false });
export const authFacebook = passport.authenticate("facebook-token", {
  session: false,
});
export const authGoogle = passport.authenticate("google-plus-token", {
  session: false,
});
