import HTTPStatus from "http-status";
import Shop from "../shop.model";
import Branch from "./branch.model";

export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ shopId: req.query.shopId });

    const branchList = branches.reduce((arr, branch) => {
      arr.push({
        ...branch.toJSON(),
      });
      return arr;
    }, []);
    return res.status(HTTPStatus.OK).json(branchList);
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const getBranch = async (req, res) => {
  try {
    const branch = await Branch.findById(req.query.branchId);
    return res.status(HTTPStatus.OK).json(branch.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const createBranch = async (req, res) => {
  try {
    const shop = await Shop.findById(req.query.shopId);
    if (!shop) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "You need to create shop first" });
    }
    const branch = await Branch.createBranch(req.body, shop._id);
    return res.status(HTTPStatus.CREATED).json(branch.toJSON());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const updateBranch = async (req, res) => {
  try {
    const promise = await Promise.all([
      Branch.findById(req.query.branchId),
      Shop.findOne({ vendor: req.user._id }),
    ]);

    if (!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You have no access to update this Branch" });
    }
    const branch = promise[0];
    Object.keys(req.body).forEach((key) => {
      branch[key] = req.body[key];
    });

    return res.status(HTTPStatus.OK).json(await branch.save());
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const promise = await Promise.all([
      Branch.findById(req.query.branchId),
      Shop.findOne({ vendor: req.user._id }),
    ]);

    if (!promise[0].shopId.equals(promise[1]._id)) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "You have no access to delete this branch" });
    }
    await promise[0].remove();
    return res.status(HTTPStatus.OK).json({ message: "Successful" });
  } catch (e) {
    console.log(e);
    return res.status(HTTPStatus.BAD_REQUEST).json(e);
  }
};
