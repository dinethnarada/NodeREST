import { Router } from "express";

import { authJwt } from "../../../services/auth.services";
import { authVendorJwt} from "../../../services/vendorauth.services";
import {allJwt} from "../../../services/allAuth.services";

import * as OperatingHoursController from "./operatingHours.controller";

const routes = new Router();
//access given to both customers and vendors
routes.get("/", allJwt, OperatingHoursController.getOperatingHours);

routes.post("/", authVendorJwt, OperatingHoursController.createOperatingHours);

routes.patch("/", authVendorJwt, OperatingHoursController.updateOperatingHours);

routes.delete("/", authVendorJwt, OperatingHoursController.deleteOperatingHours);

export default routes;
