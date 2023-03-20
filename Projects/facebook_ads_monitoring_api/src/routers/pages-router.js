import { Router } from "express";
import { listPages, newPage } from "../controllers/pages-controller.js";
import { validatePageSchema } from "../middlewares/pages-middleware.js";

const pagesRouter = Router();

pagesRouter
  .get("", listPages)
  .post("", validatePageSchema, newPage)
  .delete("/pageID")
  .put("/pageID");

export { pagesRouter };
