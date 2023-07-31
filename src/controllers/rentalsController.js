import { db } from "../database/databaseConnection.js";

export async function getRentals(req, res){


    try{
        const rentals = await db.query(`SELECT * FROM rentals;`);
        res.status(200).send(rentals.rows);
    }catch (err) {
        res.status(500).send(err.message);
    }
}