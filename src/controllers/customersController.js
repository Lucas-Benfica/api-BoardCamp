import { db } from "../database/databaseConnection.js";

export async function getCustomers(req, res){


    try{
        const customers = await db.query(`SELECT * FROM customers;`);
        res.status(200).send(customers.rows);
    }catch (err) {
        res.status(500).send(err.message);
    }
}