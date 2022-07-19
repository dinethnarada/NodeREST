import User from "./user.model";
import Cart from "../users/carts/cart.model";
import HTTPStatus from "http-status";

// params : None
// Body   : email, password, firstname, lastname, username
// Return : Newly created user details in JSON format
// Auth   : User
export const localSignUp = async (req, res) => {
  try {
    const user = await User.create({
      method: "local",
      local: {
        email: req.body.email,
        password: req.body.password,
      },
      address: req.body.address,
      mobileNumber: req.body.mobileNumber,
      username: req.body.username,
    });
    const cart = await Cart.create({
      customerId: user._id,
    });
    await cart.save();
    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (e) {
    const error = { status: false, error: e.errors };
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
};

// params : None
// Body   : None
// Return : user details in JSON format
// Auth   : User
export const login = async (req, res, next) => {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  return next();
};

// params : None
// Body   : None
// Return : user details in JSON format
// Auth   : User
export const facebookSignup = async (req, res, next) => {
  res.status(HTTPStatus.CREATED).json(req.user.toAuthJSON());
  return next();
};

// params : None
// Body   : None
// Return : user details in JSON format
// Auth   : User
export const googleSignup = async (req, res, next) => {
  res.status(HTTPStatus.CREATED).json(req.user.toAuthJSON());
  return next();
};

export const getCustomerDetails = async (req, res) => {
  try {
    const customerId = req.user._id;
    const customer = await User.findById(customerId);
    return res.status(HTTPStatus.OK).json(customer.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const updateCustomerDetails = async (req, res) => {
  try {
    const customerId = req.user._id;
    const customer = await User.findById(customerId);
    Object.keys(req.body).forEach((key) => {
      customer[key] = req.body[key];
    });
    await customer.save();
    return res.status(HTTPStatus.OK).json(customer.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
