import { Router } from "express";

import { authJwt } from "../../../services/auth.services";
import { authVendorJwt} from "../../../services/vendorauth.services";
import {allJwt} from "../../../services/allAuth.services";

import * as DeliveryFeeController from "./deliveryFee.controller";

const routes = new Router();
//access given to both customers and vendors
routes.get("/all", allJwt, DeliveryFeeController.getAllDeliveryFees);
//access given to both customers and vendors
routes.get("/", allJwt, DeliveryFeeController.getDeliveryFee);

routes.post("/", authVendorJwt, DeliveryFeeController.createDeliveryFee);

routes.patch("/", authVendorJwt, DeliveryFeeController.updateDeliveryFee);

routes.delete("/", authVendorJwt, DeliveryFeeController.deleteDeliveryFee);

export default routes;
