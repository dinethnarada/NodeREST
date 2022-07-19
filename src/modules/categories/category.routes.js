import { Router } from "express";
import { validate } from "express-validation";

import { authJwt } from "../../services/auth.services";
import { allJwt } from "../../services/allAuth.services";
import { authVendorJwt } from "../../services/vendorauth.services";

import * as CategoryController from "./category.controller";

const routes = new Router();

routes.get("/", allJwt, CategoryController.getCategories);

routes.post("/", authVendorJwt, CategoryController.createCategory);

routes.delete("/", authVendorJwt, CategoryController.deleteCategory);

export default routes;
