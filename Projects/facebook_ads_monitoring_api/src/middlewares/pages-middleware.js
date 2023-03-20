import { newPageSchema } from "../schemas/pages-schemas.js";

export function validatePageSchema(req, res, next) {
  const { error } = newPageSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }
  next();
}