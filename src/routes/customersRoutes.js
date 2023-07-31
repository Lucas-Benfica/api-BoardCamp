import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
//import { schemaTransaction } from "../schemas/transactionSchemas.js";
import { getCustomers } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);

export default customersRouter;