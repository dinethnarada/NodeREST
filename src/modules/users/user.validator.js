import { Joi } from "express-validation";

export const passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;

export default {
  signup: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().regex(passwordReg).required(),
      address: Joi.string().required(),
      mobileNumber: Joi.number().required(),
      username: Joi.string().required(),
    }),
  },
};
