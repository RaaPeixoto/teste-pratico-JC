import Joi from "joi";

export const newPageSchema = Joi.object({
  title: Joi.string().required(),
  url: Joi.string().required(),
});