import HTTPStatus from "http-status";
import Shop from "../shop.model";
import OperatingHours from "./operatingHours.model";

export const getOperatingHours = async (req, res) => {
  try{
    const operatingHours = await OperatingHours.find({ shopId: req.query.shopId});

    const operatingHoursList = operatingHours.reduce((arr, operatingHours) => {
      arr.push({
        ...operatingHours.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(operatingHoursList);
  } catch (e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const createOperatingHours = async (req, res) => {
  try{
    const shop = await Shop.findById(req.query.shopId);
    if(!shop) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({error: "You need to create the shop first"});
    }
    const operatingHours  = await OperatingHours.createOperatingHours(req.body, shop._id);
    return res.status(HTTPStatus.CREATED).json(operatingHours.toJSON());
  } catch(e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const updateOperatingHours = async (req, res) => {
  try {
    const promise = await Promise.all([
      OperatingHours.findById(req.query.operatingHoursId),
      Shop.findOne({ vendor: req.user._id})
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)){
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do not have access to modify the operating hours for this shop"});
    }
    const operatingHours = promise[0];
    Object.keys(req.body).forEach((key) => {
      operatingHours[key] = req.body[key]
    });

    return res.status(HTTPStatus.OK).json(await operatingHours.save());
  } catch(e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const deleteOperatingHours = async(req, res) => {
  try {
    const promise = await Promise.all([
      OperatingHours.findById(req.query.operatingHoursId),
      Shop.findOne({ vendor: req.user._id}),
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do have access to delete the operating hours for this shop"});
    }
    await promise[0].remove();
    return res.status(HTTPStatus.OK).json( { message: "Successful" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
