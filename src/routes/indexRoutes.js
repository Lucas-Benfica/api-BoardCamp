import { Router } from "express";
import customersRouter from "./customersRoutes.js";
import gamesRouter from "./gamesRoutes.js";
import rentalsRouter from "./rentalsRoutes.js";

const router = Router();

router.use(gamesRouter);
router.use(customersRouter);
router.use(rentalsRouter);

export default router;
