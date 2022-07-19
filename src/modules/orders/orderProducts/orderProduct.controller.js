import HTTPStatus from "http-status";
import Order from "../order.model";
import User from "../../users/user.model";
import Shop from "../../shops/shop.model";
import Product from "../../products/product.model"
import OrderProduct from "./orderProduct.model"

//get all products of an order --> Shop
export const getAllOrderProductsShop = async (req, res) => {
  try{
    //validate access
    const promise = await Promise.all([
      Order.findById(req.query.orderId ),
      Shop.findOne({ vendor: req.user._id }),
    ]);

    if (!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do not have access to order data of this shop" });
    }
    //retrieve data from db
    const orderProducts = await OrderProduct.find({ orderId: req.query.orderId});

    const orderProductList = orderProducts.reduce((arr, order) => {
      arr.push({
        ...order.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(orderProductList);
  } catch (e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//get all products of an order --> customer
export const getAllOrderProductsCustomer = async (req, res) => {
  try{
    //validate access
    const promise = await Promise.all([
      Order.findById(req.query.orderId),
      User.findById(req.user._id),
    ]);

    if (!promise[0].customerId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do not have access to order data of this customer" });
    }
    //retrieve data from db
    const orderProducts = await OrderProduct.find({ orderId: req.query.orderId});

    const orderProductList = orderProducts.reduce((arr, order) => {
      arr.push({
        ...order.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(orderProductList);
  } catch (e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//get one order products
export const getOrderProduct = async (req, res) => {
  try{
    const order  = await OrderProduct.findById(req.query.orderProductId);
    return res.status(HTTPStatus.OK).json(order.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//customer placing order --> adding product
export const createOrderProduct = async (req, res) => {
  try{
    //validate access
    const promise = await Promise.all([
      Order.findById(req.query.orderId),
      User.findById(req.user._id),
    ]);

    if (!promise[0].customerId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do not have access to add products to an order by this customer" });
    }
    const product = await Product.findById(req.query.productId);
    if(!product) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({error: "Invalid product id"});
    }
    const orderProduct  = await OrderProduct.createOrderProduct(req.body, promise[0]._id, product._id);
    return res.status(HTTPStatus.CREATED).json(orderProduct.toJSON());
  } catch(e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//update order product details by shop
export const updateOrderProduct = async (req, res) => {
  try {
    const orderProduct = await OrderProduct.findById(req.query.orderProductId);
    const promise = await Promise.all([
      Order.findById(orderProduct.orderId),
      Shop.findOne({ vendor: req.user._id})
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)){
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do not have access to modify this order"});
    }

    Object.keys(req.body).forEach((key) => {
      orderProduct[key] = req.body[key]
    });

    return res.status(HTTPStatus.OK).json(await orderProduct.save());
  } catch(e) {
    console.log(e)
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//delete order product --> customer
export const deleteOrderProductCustomer = async(req, res) => {
  try {
    const orderProduct = await OrderProduct.findById(req.query.orderProductId);
    const promise = await Promise.all([
      Order.findById(orderProduct.orderId),
      User.findById(req.user._id),
    ]);

    if(!promise[0].customerId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do have access to delete this Order Product"});
    }
    await orderProduct.remove();
    return res.status(HTTPStatus.OK).json( { message: "Successful" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

//delete order product --> shop
export const deleteOrderProductShop = async(req, res) => {
  try {
    const orderProduct = await OrderProduct.findById(req.query.orderProductId)
    const promise = await Promise.all([
      Order.findById(orderProduct.orderId),
      Shop.findOne({ vendor: req.user._id }),
    ]);

    if(!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You do have access to delete this Order Product"});
    }

    await orderProduct.remove();
    return res.status(HTTPStatus.OK).json( { message: "Successful" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
