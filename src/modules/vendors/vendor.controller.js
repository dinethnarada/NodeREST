import Vendor from "./vendor.model";
import HTTPStatus from "http-status";

// params : None
// Body   : email, password, telephone no
// Return : user details in JSON format
// Auth   : vendor
export const vendorSignup = async (req, res) => {
  try {
    const vendor = await Vendor.create({
      email: req.body.email,
      contactNo: req.body.contactNo,
      password: req.body.password,
    });
    return res.status(HTTPStatus.CREATED).json(vendor.toAuthJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

// params : None
// Body   : None
// Return : user details in JSON format
// Auth   : Vendor
export const vendorLogin = async (req, res, next) => {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  return next();
};

export const getVendorDetails = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const vendor = await Vendor.findById(vendorId);
    return res.status(HTTPStatus.OK).json(vendor.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const updateVendorDetails = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const vendor = await Vendor.findById(vendorId);
    Object.keys(req.body).forEach((key) => {
      vendor[key] = req.body[key];
    });
    await vendor.save();
    return res.status(HTTPStatus.OK).json(vendor.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
