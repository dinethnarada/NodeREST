import { Router } from "express";
import { validate } from "express-validation";

import { authJwt } from "../../../services/auth.services";
import { allJwt } from "../../../services/allAuth.services";
import { authVendorJwt } from "../../../services/vendorauth.services";

import * as RatingController from "./rating.controller";

const routes = new Router();

routes.get("/all", allJwt, RatingController.getRatingsByStoreId);
routes.get("/", allJwt, RatingController.getRatingByRatingId);
routes.get("/customer", authVendorJwt, RatingController.getRatingsByCustomerId);
routes.get("/order", authJwt, RatingController.getRatingByOrderId);
routes.post("/", authJwt, RatingController.addRatingByStoreId);
//routes.patch("/", authJwt, RatingController.updateRatingByCustomerId);
routes.delete("/", authJwt, RatingController.deleteRatingByOrderId);

export default routes;
