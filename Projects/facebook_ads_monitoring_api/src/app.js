import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
import { pagesRouter } from "./routers/pages-router.js";



const app = express();
dotenv.config();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/pages",pagesRouter)


/* const port = process.env.PORT || 5000; */
const port = 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));