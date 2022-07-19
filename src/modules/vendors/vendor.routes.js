import { Router } from "express";
//import { validate } from "express-validation";
//import passport from "passport";

import { authVendor } from "../../services/vendorauth.services";
import { authVendorJwt } from "../../services/vendorauth.services";
import * as vendorController from "./vendor.controller";
//import vendorValidator from "./vendor.validator";

const routes = new Router();

// POST -> vendor local signup
routes.post("/signup", vendorController.vendorSignup);
// POST -> vendor local login
routes.post("/login", authVendor, vendorController.vendorLogin);

routes.get("/", authVendorJwt, vendorController.getVendorDetails);

routes.patch("/", authVendorJwt, vendorController.updateVendorDetails);

export default routes;
