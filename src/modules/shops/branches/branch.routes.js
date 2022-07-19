import { Router } from "express";
import { validate } from "express-validation";

import { authJwt } from "../../../services/auth.services";
import { allJwt } from "../../../services/allAuth.services";
import { authVendorJwt } from "../../../services/vendorauth.services";

import * as BranchController from "./branch.controller";

const routes = new Router();

routes.get("/all", allJwt, BranchController.getAllBranches);

routes.get("/", allJwt, BranchController.getBranch);

routes.post("/", authVendorJwt, BranchController.createBranch);

routes.patch("/", authVendorJwt, BranchController.updateBranch);

routes.delete("/", authVendorJwt, BranchController.deleteBranch);

export default routes;
