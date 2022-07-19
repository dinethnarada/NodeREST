import HTTPStatus, { BAD_REQUEST } from "http-status";
import Shop from "../shops/shop.model";
import Vendor from "../vendors/vendor.model";
import Product from "./product.model";

// params : none
// Body   : filters - price range, category, shopId
// Return : All products in given store
// Auth   : Vendor
export const getAllProductsFiltered = async (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "quantity";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  try {
    const gtprice = req.body.gtprice ? req.body.gtprice : 0;
    const ltprice = req.body.ltprice ? req.body.ltprice : 1000; // default value. TODO - change this defalut value to constant value
    const categoryId = req.query.categoryId;
    const findArgs = {};
    if (gtprice != 0 || ltprice != 0) {
      findArgs["price"] = {
        $gte: parseInt(gtprice),
        $lte: parseInt(ltprice),
      };
    }
    if (categoryId != null) {
      findArgs["categoryId"] = categoryId;
    }
    findArgs["shopId"] = req.query.shopId;
    console.log(findArgs);
    const products = await Product.find(findArgs)
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);
    return res.status(HTTPStatus.OK).json(products);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : category Id
// Body   : None
// Return : All products related to category in given shop
// Auth   : Users
export const getProductsByCategoryId = async (req, res) => {
  try {
    const products = await Product.find({
      shopId: req.query.shopId,
      categoryId: req.query.categoryId,
    });
    const prodList = products.reduce((arr, products) => {
      arr.push({
        ...products.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(prodList);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : store Id
// Body   : None
// Return : All products in given shop
// Auth   : Users
export const getAllShopProducts = async (req, res) => {
  try {
    const products = await Product.find({ shopId: req.query.shopId });

    const prodList = products.reduce((arr, products) => {
      arr.push({
        ...products.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(prodList);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : product Id
// Body   : None
// Return : Product related to the ID
// Auth   : Users
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.query.prodId);
    return res.status(HTTPStatus.OK).json(product.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : search
// Body   : none
// Return : searched results
// Auth   : Customer
export const searchProducts = async (req, res) => {
  const limit = parseInt(req.query.limit, 0);
  try {
    const search = req.query.search;
    const shops = await Product.find({
      tags: { $regex: new RegExp(search) },
    }).limit(limit);
    return res.status(HTTPStatus.OK).json(shops);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : none
// Body   : title, price, quantity, description
// Return : Newly created product details in JSON format
// Auth   : Vendor
export const createProduct = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user._id);
    const shop = await Shop.findOne({ vendor: vendor });
    if (!shop._id.equals(req.query.shopId)) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "You are not the correct user" });
    }
    const product = await Product.createProduct(req.body, req.query);
    product.addMediaUrl(req.body.imageurl, req.body.videourl);
    product.addTags(req.body.tags);
    await product.save();
    return res.status(HTTPStatus.CREATED).json(product.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : product id
// Body   : title, price, quantity, description (not required)
// Return : updated product details relavant to the product id in JSON format
// Auth   : Vendor
export const updateProduct = async (req, res) => {
  try {
    const promise = await Promise.all([
      Product.findById(req.query.prodId),
      Shop.findOne({ vendor: req.user._id }),
    ]);

    if (!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You have no access to update this product" });
    }
    const product = promise[0];
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });
    product.updateMediaAndTags(
      req.body.imageurl,
      req.body.videourl,
      req.body.tags
    );
    return res.status(HTTPStatus.OK).json(await product.save());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : product id
// Body   : None
// Return : Successful Message or error message
// Auth   : Vendor
export const deleteProduct = async (req, res) => {
  try {
    const promise = await Promise.all([
      Product.findById(req.query.prodId),
      Shop.findOne({ vendor: req.user._id }),
    ]);

    if (!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You have no access to delete this product" });
    }
    await promise[0].remove();
    return res.status(HTTPStatus.OK).json({ message: "Successful" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
