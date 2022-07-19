import userRoutes from "./users/user.routes";
import cartRoutes from "./users/carts/cart.routes";
import productRoutes from "./products/product.routes";
import vendorRoutes from "./vendors/vendor.routes";
import shopRoutes from "./shops/shop.routes";
import branchRoutes from "./shops/branches/branch.routes";
import categoryRoutes from "./categories/category.routes";
import deliveryFeeRoutes from "./shops/deliveryFees/deliveryFee.routes";
import operatingHoursRoutes from "./shops/operatingHours/operatingHours.routes";
import ratingRoutes from "./users/ratings/rating.routes";
import orderRoutes from "./orders/order.routes";
import orderProductRoutes from "./orders/orderProducts/orderProduct.routes";

export default (app) => {
  app.use("/api/v1/vendors", vendorRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/users/ratings", ratingRoutes);
  app.use("/api/v1/users/carts", cartRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/shops", shopRoutes);
  app.use("/api/v1/shops/branches", branchRoutes);
  app.use("/api/v1/shops/categories", categoryRoutes);
  app.use("/api/v1/shops/deliveryFees", deliveryFeeRoutes);
  app.use("/api/v1/shops/operatingHours", operatingHoursRoutes);
  app.use("/api/v1/orders", orderRoutes);
  app.use("/api/v1/orders/orderProducts", orderProductRoutes);
};
