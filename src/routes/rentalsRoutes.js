import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaRentals } from "../schemas/rentals.Schemas.js";
import { deleteRental, finalizeRental, getRentals, postRentals } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", validateSchema(schemaRentals), postRentals);
rentalsRouter.post("/rentals/:id/return", finalizeRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;