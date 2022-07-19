import HTTPStatus from "http-status";

import Shop from "./shop.model";
import Vendor from "../vendors/vendor.model";

// params : store id
// Body   : None
// Return : Store details in JSON format
// Auth   : Vendor
export const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.query.shopId);
    return res.status(HTTPStatus.OK).json({ ...shop.toJSON() });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : limit, skip, category
// Body   : None
// Return : All shops details in store database in JSON format
// Auth   : User
export const getAllShops = async (req, res) => {
  const limit = parseInt(req.query.limit, 0);
  const skip = parseInt(req.query.skip, 0);
  try {
    const category = req.body.category;
    if (category != null) {
      const shops = await Shop.find({ industry: category }).limit(limit);
      const shopList = shops.reduce((arr, shop) => {
        arr.push({
          ...shop.toJSON(),
        });
        return arr;
      }, []);
      return res.status(HTTPStatus.OK).json(shopList);
    }
    const promise = await Promise.all([Shop.list({ limit, skip })]);
    const shops = promise[0].reduce((arr, shop) => {
      arr.push({
        ...shop.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(shops);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : None
// Body   : business name, address, industry, business size, business registration number (not required)
// Return : Newly Created store details in JSON format
// Auth   : Vendor
export const createShop = async (req, res) => {
  try {
    const promise = await Promise.all([
      Vendor.findById(req.user._id),
      Shop.findOne({ vendor: req.user._id }),
    ]);
    const vendor = promise[0];
    if (!promise[1]) {
      const shop = await Shop.create({
        businessName: req.body.businessName,
        address: req.body.address,
        industry: req.body.industry,
        businessSize: req.body.businessSize,
        businessRegNo: req.body.businessRegNo,
        vendor: vendor,
      });
      return res.status(HTTPStatus.CREATED).json(shop.toJSON());
    } else {
      return res
        .status(HTTPStatus.OK)
        .json({ error: "Vendor already has a Shop" });
    }
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : store id
// Body   : storename, storeaddress (Not required)
// Return : Updated store details
// Auth   : Vendor (Logged)
export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ vendor: req.user._id });

    Object.keys(req.body).forEach((key) => {
      shop[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await shop.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : None
// Body   : None
// Return : Successful Message or error message
// Auth   : Vendor
export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ vendor: req.user._id });
    await shop.remove();
    return res.sendStatus(HTTPStatus.OK);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
