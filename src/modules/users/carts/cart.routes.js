import { Router } from "express";

import { authJwt } from "../../../services/auth.services";
import { authVendorJwt } from "../../../services/vendorauth.services";

import * as CartController from "./cart.controller";

const routes = new Router();

routes.get("/", authJwt, CartController.getCart);

routes.post("/", authJwt, CartController.addItemToCart);

routes.delete("/", authJwt, CartController.deleteProduct);

routes.delete("/all", authJwt, CartController.emptyCart);

export default routes;
