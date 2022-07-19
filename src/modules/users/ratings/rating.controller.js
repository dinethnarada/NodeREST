import HTTPStatus from "http-status";

import Rating from "./rating.model";
import User from "../user.model";
import Shop from "../../shops/shop.model";

export const getRatingByRatingId = async (req, res) => {
  try {
    const rating = await Rating.findById(req.query.ratingId);
    return res.status(HTTPStatus.OK).json(rating.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const getRatingsByStoreId = async (req, res) => {
  try {
    // const customer = await User.findById(req.user._id);
    // if (!customer._id.equals(req.query.customerId)) {
    //   return res
    //     .status(HTTPStatus.UNAUTHORIZED)
    //     .json({ error: "You are not permitted user!" });
    // }
    const ratings = await Rating.find({ shopId: req.query.shopId });
    const ratingList = ratings.reduce((arr, rating) => {
      arr.push({
        ...rating.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(ratingList);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const getRatingsByCustomerId = async (req, res) => {
  try {
    const customerId = req.query.customerId;
    const shop = await Shop.find({ vendor: req.user._id });
    const ratings = await Rating.find({
      customerId: customerId,
      shopId: shop[0]._id,
    });
    const ratingList = ratings.reduce((arr, rating) => {
      arr.push({
        ...rating.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(ratingList);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const getRatingByOrderId = async (req, res) => {
  try {
    const customer = await User.findById(req.user._id);
    if (!customer._id.equals(req.query.customerId)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You are not permitted user!" });
    }
    const rating = await Rating.find({
      orderId: req.query.orderId,
    });
    return res.status(HTTPStatus.OK).json(rating[0].toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// parameters - customerId, shopId, orderId
export const addRatingByStoreId = async (req, res) => {
  try {
    const customer = await User.findById(req.user._id);
    if (!customer._id.equals(req.query.customerId)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You are not permitted user!" });
    }
    const rating = await Rating.create({
      shopId: req.query.shopId,
      orderId: req.query.orderId,
      customerId: req.query.customerId,
      rating: req.body.rating,
    });
    return res.status(HTTPStatus.CREATED).json(rating.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// export const updateRatingByCustomerId = async (req, res) => {
//   try {
//     const customer = await User.findById(req.user._id);
//     const rating = await Rating.findById(req.query.ratingId);
//     if (
//       !customer._id.equals(req.query.customerId) ||
//       !rating.customerId.equals(req.query.customerId)
//     ) {
//       return res
//         .status(HTTPStatus.UNAUTHORIZED)
//         .json({ error: "You are not permitted user!" });
//     }
//     rating["rating"] = req.body.rating;
//     return res.status(HTTPStatus.OK).json(await rating.save());
//   } catch (e) {
//     console.log(e);
//     return res.status(HTTPStatus.BAD_REQUEST).json(e);
//   }
// };

export const deleteRatingByOrderId = async (req, res) => {
  try {
    const customer = await User.findById(req.user._id);
    const rating = await Rating.find({ orderId: req.query.orderId });
    if (
      !customer._id.equals(req.query.customerId) ||
      !rating.customerId.equals(req.query.customerId)
    ) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You are not permitted user!" });
    }
    rating.remove();
    return res.status(HTTPStatus.OK).json({ message: "successful!" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
