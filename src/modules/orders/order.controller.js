import HTTPStatus from "http-status";
import Shop from "../shops/shop.model";
import Order from "./order.model";
import Cart from "../users/carts/cart.model";
import Product from "../products/product.model";
import User from "../users/user.model";
import mongoose from "mongoose";

//get all orders
// export const getAllOrders = async (req, res)

//get all orders of a shop
export const getShopOrders = async (req, res) => {
  try{
    //validate access
    const promise = await Promise.all([
      Shop.findOne({ vendor: req.user._id }),
    ]);
    //retrieve data from db
    const orders = await Order.find({ shopId: promise[0]._id});

    const orderList = orders.reduce((arr, order) => {
      arr.push({
        ...order.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(orderList);
  } catch (e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//get all orders of a customer
export const getCustomerOrders = async (req, res) => {
  try{
    //retrieve data from db
    const orders = await Order.find({ customerId: req.user._id});

    const orderList = orders.reduce((arr, order) => {
      arr.push({
        ...order.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(orderList);
  } catch (e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//get one order
export const getOrder = async (req, res) => {
  try{
    const order  = await Order.findById(req.query.orderId);
    return res.status(HTTPStatus.OK).json(order.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//customer placing order
export const createOrder = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  try{
    // const opts = { session, new: true}
    const shop = await Shop.findById(req.query.shopId);
    if(!shop) {
      // await session.abortTransaction();
      // session.endSession();
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({error: "Invalid shop id"});
    }
    const cart = await Cart.findOne({ customerId: req.user._id });
    const items = cart.items;
    const orderTotal = cart.subTotal;
    //options
    const order  = await Order.createOrder(req.body, items, orderTotal, shop._id, req.user._id);
    console.log(order);
    console.log(order.toJSON())
    if (order){
      for (let i = 0; i<items.length; i++){
        let product = await Product.findById(items[i].productId)
        let quantity = items[i].quantity;
        let availableQuantity = product.quantity;
        if (quantity< availableQuantity) {
          product.quantity = availableQuantity - quantity;
          console.log(availableQuantity-quantity);
          //options
          await product.save();
        }
        else{
          // await session.abortTransaction();
          // session.endSession();
          return res
            .status(HTTPStatus.BAD_REQUEST)
            .json({error: `Order quantity of ${items[i].productName} exceeds available quantity!` });
        }
      }
    }
    else{
      // await session.abortTransaction();
      // session.endSession();
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({error: "Creation of order failed" });
    }
    // await session.commitTransaction();
    // session.endSession();
    return res.status(HTTPStatus.CREATED).json(order.toJSON());
  } catch(e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//update order status by vendor
export const updateOrderStatus = async (req, res) => {
  try {
    const promise = await Promise.all([
      Order.findById(req.query.orderId),
      Shop.findOne({ vendor: req.user._id})
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)){
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do not have access to modify this order"});
    }
    const order = promise[0];
    // Object.keys(req.body).forEach((key) => {
    //   order[key] = req.body[key]
    // });
    order["statusUpdatedAt"] = Date.now();
    order["orderStatus"] = req.body["orderStatus"];

    return res.status(HTTPStatus.OK).json(await order.save());
  } catch(e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//delete order
export const deleteOrder = async(req, res) => {
  try {
    const promise = await Promise.all([
      Order.findById(req.query.orderId),
      Shop.findOne({ vendor: req.user._id}),
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do have access to delete this Order"});
    }
    await promise[0].remove();
    return res.status(HTTPStatus.OK).json( { message: "Successful" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
