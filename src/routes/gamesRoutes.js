import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaGames } from "../schemas/gamesSchemas.js";
import { getGames, postGame } from "../controllers/gamesController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", validateSchema(schemaGames), postGame);

export default gamesRouter;