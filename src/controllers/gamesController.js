import { db } from "../database/databaseConnection.js";

/*
    {
    id: 1,
    name: 'Banco Imobiliário',
    image: 'http://',
    stockTotal: 3,
    pricePerDay: 1500,
    }
*/

//Read 
export async function getGames(req, res){

    try{
        const games = await db.query(`SELECT * FROM games;`);
        res.status(200).send(games.rows);
    }catch (err) {
        res.status(500).send(err.message);
    }

}

export async function postGame(req, res){
    const {name, image, stockTotal, pricePerDay} = req.body;

    try{

        const game = await db.query(`SELECT * FROM games WHERE name=$1`, [name]);
        if(game){
            console.log("O jogo já existe");
            return res.status(409).send("O jogo já existe");
        }

        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ('${name}', '${image}', ${stockTotal}, ${pricePerDay});`);

        res.sendStatus(201);
    }catch (err) {
        res.status(500).send(err.message);
    }
}