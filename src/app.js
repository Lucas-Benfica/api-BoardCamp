import express from "express"
import cors from "cors"
import router from "./routes/indexRoutes.js"
import dotenv from "dotenv";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

dotenv.config()

const port = process.env.PORT || 5000

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})
