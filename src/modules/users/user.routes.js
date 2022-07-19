import { Router } from "express";
import { validate } from "express-validation";
import passport from "passport";
import {
  authLocal,
  authFacebook,
  authGoogle,
} from "../../services/auth.services";

import { authJwt } from "../../services/auth.services";

import * as userController from "./user.controller";
import userValidator from "./user.validator";

const routes = new Router();

// POST -> user local signup
routes.post(
  "/signup",
  validate(userValidator.signup),
  userController.localSignUp
);
// POST -> user local login
routes.post("/login", authLocal, userController.login);
// POST -> user facebook signup
routes.post("/facebook", authFacebook, userController.facebookSignup);
// POST -> user redirect after authentication
routes.post(
  "/facebook/redirect",
  passport.authenticate("facebook", {
    successRedirect: "/home",
    failureRedirect: "/",
  })
);
// POST -> user google+ signup
routes.post("/google", authGoogle, userController.googleSignup);

routes.get("/", authJwt, userController.getCustomerDetails);

routes.patch("/", authJwt, userController.updateCustomerDetails);

export default routes;
