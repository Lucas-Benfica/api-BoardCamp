import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaCustomers } from "../schemas/customersSchemas.js";
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from "../controllers/customersController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomerById);
customersRouter.post("/customers", validateSchema(schemaCustomers), postCustomer);
customersRouter.put("/customers/:id",validateSchema(schemaCustomers), updateCustomer);

export default customersRouter;