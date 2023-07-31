import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
//import { schemaTransaction } from "../schemas/transactionSchemas.js";
import { getRentals } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);

export default rentalsRouter;