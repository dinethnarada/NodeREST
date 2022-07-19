import { Router } from "express";
import { validate } from "express-validation";

import { authJwt } from "../../services/auth.services";
import { allJwt } from "../../services/allAuth.services";
import { authVendorJwt } from "../../services/vendorauth.services";

import * as productController from "./product.controller";
import productValidator from "./product.validator";
import { all } from "underscore";

const routes = new Router();

// GET -> Get filtered products
routes.get("/filter", authVendorJwt, productController.getAllProductsFiltered);
// GET -> Get all products in a requested store
routes.get("/all", allJwt, productController.getAllShopProducts);
// GET -> Get a product by product ID
routes.get("/", allJwt, productController.getProductById);
// GET -> Get all products by category ID
routes.get("/category", allJwt, productController.getProductsByCategoryId);
// POST -> Add a product to store
routes.post("/", authVendorJwt, productController.createProduct);
// POST -> serach products
routes.post("/search", authJwt, productController.searchProducts);
// PATCH -> Update a product in vendor store
routes.patch("/", authVendorJwt, productController.updateProduct);
// DELETE -> Delete a product in vendor's store
routes.delete("/", authVendorJwt, productController.deleteProduct);

export default routes;
