import { Router } from "express";
import { validate } from "express-validation";

import { authJwt } from "../../services/auth.services";
import { allJwt } from "../../services/allAuth.services";
import { authVendorJwt } from "../../services/vendorauth.services";

import * as storeController from "./shop.controller";
import storeValidator from "./shop.validation";

const routes = new Router();
// GET -> Get a relavent store according to the ID
routes.get("/", allJwt, storeController.getShop);
// GET -> Get all shops
routes.get("/all", allJwt, storeController.getAllShops);
// POST -> create a store to a vendor
routes.post("/", authVendorJwt, storeController.createShop);
// PATCH -> update the details
routes.patch("/", authVendorJwt, storeController.updateShop);
// DELETE -> delete a store
routes.delete("/", authVendorJwt, storeController.deleteShop);

export default routes;
