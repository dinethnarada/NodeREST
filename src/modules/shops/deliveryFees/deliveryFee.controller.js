import HTTPStatus from "http-status";
import Shop from "../shop.model";
import DeliveryFee from "./deliveryFee.model";

export const getAllDeliveryFees = async (req, res) => {
  try{
    const deliveryFees = await DeliveryFee.find({ shopId: req.query.shopId});

    const deliveryFeeList = deliveryFees.reduce((arr, deliveryFee) => {
      arr.push({
        ...deliveryFee.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(deliveryFeeList);
  } catch (e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const getDeliveryFee = async (req, res) => {
  try{
    const deliveryFee  = await DeliveryFee.findById(req.query.deliveryFeeId);
    return res.status(HTTPStatus.OK).json(deliveryFee.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const createDeliveryFee = async (req, res) => {
  try{
    const shop = await Shop.findById(req.query.shopId);
    if(!shop) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({error: "You need to create the shop first"});
    }
    const deliveryFee  = await DeliveryFee.createDeliveryFee(req.body, shop._id);
    return res.status(HTTPStatus.CREATED).json(deliveryFee.toJSON());
  } catch(e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const updateDeliveryFee = async (req, res) => {
  try {
    const promise = await Promise.all([
      DeliveryFee.findById(req.query.deliveryFeeId),
      Shop.findOne({ vendor: req.user._id})
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)){
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do not have access to modify this delivery fee"});
    }
    const deliveryFee = promise[0];
    Object.keys(req.body).forEach((key) => {
      deliveryFee[key] = req.body[key]
    });

    return res.status(HTTPStatus.OK).json(await deliveryFee.save());
  } catch(e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const deleteDeliveryFee = async(req, res) => {
  try {
    const promise = await Promise.all([
      DeliveryFee.findById(req.query.deliveryFeeId),
      Shop.findOne({ vendor: req.user._id}),
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do have access to delete this Delivery Fee"});
    }
    await promise[0].remove();
    return res.status(HTTPStatus.OK).json( { message: "Successful" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
