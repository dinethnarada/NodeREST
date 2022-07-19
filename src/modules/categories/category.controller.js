import HTTPStatus from "http-status";
import Category from "./category.model";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ shopId: req.query.shopId });
    const catList = categories.reduce((arr, category) => {
      arr.push({
        ...category.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(catList);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      shopId: req.query.shopId,
      category: req.body.category,
    });
    return res.status(HTTPStatus.CREATED).json(category.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.query.categoryId);
    await category.remove();
    return res.status(HTTPStatus.OK).json({ message: "Success" });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
