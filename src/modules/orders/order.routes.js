import { Router } from "express";

import { authJwt } from "../../services/auth.services";
import { authVendorJwt} from "../../services/vendorauth.services";
import {allJwt} from "../../services/allAuth.services"

import * as OrderController from "./order.controller";

const routes = new Router();
//access given to vendors
routes.get("/shop", authVendorJwt, OrderController.getShopOrders);
//access given to customers
routes.get("/customer", authJwt, OrderController.getCustomerOrders);
//access given to both customers and vendors
routes.get("/", allJwt, OrderController.getOrder);

routes.post("/customer", authJwt, OrderController.createOrder);

routes.patch("/shop", authVendorJwt, OrderController.updateOrderStatus);

routes.delete("/shop", authVendorJwt, OrderController.deleteOrder);

export default routes;
