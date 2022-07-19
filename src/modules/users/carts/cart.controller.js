import HTTPStatus from "http-status";

import Cart from "./cart.model";
import Product from "../../products/product.model";

export const addItemToCart = async (req, res) => {
  const productId = req.body.productId;
  const quantity = Number.parseInt(req.body.quantity);
  try {
    const cartItem = await Cart.find({ customerId: req.user._id });
    const product = await Product.findById(productId);
    const cart = cartItem[0];

    if (product.quantity < quantity) {
      return res
        .status(HTTPStatus.OK)
        .json({ error: "Not available quantity" });
    }
    // if (!cart) {
    //   const cart = await Cart.create({
    //     shopId: product.shopId,
    //     customerId: req.user._id,
    //     items: [
    //       {
    //         productId: productId,
    //         productImage: product.media.imageurl[0],
    //         productName: product.title,
    //         quantity: quantity,
    //         total: parseInt(product.price * quantity),
    //         unitPrice: product.price,
    //       },
    //     ],
    //     subTotal: parseInt(product.price * quantity),
    //   });
    //   await cart.save();
    //   return res.status(HTTPStatus.OK).json(cart.toJSON());
    // } else {
    //---- Check if index exists ----
    const indexFound = cart.items.findIndex(
      (item) => item.productId == productId
    );
    if (indexFound !== -1) {
      cart.items[indexFound].quantity = quantity;
      cart.items[indexFound].total =
        cart.items[indexFound].quantity * product.price;
      cart.items[indexFound].unitPrice = product.price;
      cart.subTotal = cart.items
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
    } else if (quantity > 0) {
      // check whether the customer only choose products in one store
      const shopId = product.shopId;
      if (cart.shopId == null) {
        cart.shopId = shopId;
      }
      if (!shopId.equals(cart.shopId)) {
        return res
          .status(HTTPStatus.BAD_REQUEST)
          .json({ error: "you can add only products in one shop" });
      }
      cart.items.push({
        productId: productId,
        productImage: product.media.imageurl[0],
        productName: product.title,
        quantity: quantity,
        unitPrice: product.price,
        total: parseInt(product.price * quantity),
      });
      cart.subTotal = cart.items
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
    }
    return res.status(HTTPStatus.OK).json(await cart.save());
    // }
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ customerId: req.user._id });
    if (!cart) {
      return res.status(HTTPStatus.OK).json({ error: "Empty Cart" });
    }
    return res.status(HTTPStatus.OK).json(cart);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const cartItem = await Cart.find({ customerId: req.user._id });
    const productId = req.query.productId;
    const cart = cartItem[0];
    const indexFound = cart.items.findIndex(
      (item) => item.productId == productId
    );
    cart.items.splice(indexFound, 1);
    if (cart.items.length == 0) {
      cart.shopId = undefined;
      cart.subTotal = 0;
    } else {
      cart.subTotal = cart.items
        .map((item) => item.total)
        .reduce((acc, next) => acc + next);
    }
    return res.status(HTTPStatus.OK).json(await cart.save());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const emptyCart = async (req, res) => {
  try {
    await Cart.update(
      { customerId: req.user._id },
      { $set: { items: [], subTotal: 0, shopId: undefined } }
    );
    const cart = await Cart.find({ customerId: req.user._id });
    return res.status(HTTPStatus.OK).json(cart);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
