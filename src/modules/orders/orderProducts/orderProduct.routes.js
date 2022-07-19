import { Router } from "express";

import { authJwt } from "../../../services/auth.services";
import { authVendorJwt} from "../../../services/vendorauth.services";
import {allJwt} from "../../../services/allAuth.services";

import * as OrderProductController from "./orderProduct.controller";

const routes = new Router();
//access given to vendors
routes.get("/shop", authVendorJwt, OrderProductController.getAllOrderProductsShop);
//access given to customers
routes.get("/customer", authJwt, OrderProductController.getAllOrderProductsCustomer);
//access given to both customers and vendors
routes.get("/", allJwt, OrderProductController.getOrderProduct);

routes.post("/customer", authJwt, OrderProductController.createOrderProduct);

routes.patch("/shop", authVendorJwt, OrderProductController.updateOrderProduct);

routes.delete("/shop", authVendorJwt, OrderProductController.deleteOrderProductShop);

routes.delete("/customer", authJwt, OrderProductController.deleteOrderProductCustomer);

export default routes;
