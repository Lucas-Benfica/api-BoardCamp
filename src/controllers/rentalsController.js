import { db } from "../database/databaseConnection.js";
import dayjs from "dayjs";

/*
    {
    id: 1,
    customerId: 1,
    gameId: 1,
    rentDate: '2021-06-20',    // data em que o aluguel foi feito
    daysRented: 3,             // por quantos dias o cliente agendou o aluguel
    returnDate: null,          // data que o cliente devolveu o jogo (null enquanto não devolvido)
    originalPrice: 4500,       // preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)
    delayFee: null             // multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)
    }
*/

export async function getRentals(req, res) {

    try {
        const rentalsAll = await db.query(`
            SELECT rentals.*, 
            customers.id AS idcustomer, customers.name AS namecustomer,
            games.id AS idgame, games.name AS namegames
            FROM rentals
            JOIN customers ON customers.id = rentals."customerId"
            JOIN games ON games.id = rentals."gameId";
            `);

        const rentals = rentalsAll.rows;

        const listRentals = rentals.map((r) => {
            return {
                id: r.id,
                customerId: r.customerId,
                gameId: r.gameId,
                rentDate: r.rentDate,
                daysRented: r.daysRented,
                returnDate: r.returnDate,
                originalPrice: r.originalPrice,
                delayFee: r.delayFee,
                customer: {
                    id: r.idcustomer,
                    name: r.namecustomer
                },
                game: {
                    id: r.idgame,
                    name: r.namegames
                }
            }
        })

        res.status(200).send(listRentals);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);
        if(!customer.rows[0]){
            return res.sendStatus(400);
        }
    
        const game = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        if(!game.rows[0]){
            return res.sendStatus(400);
        }

        const gamesRented = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId]);

        if (gamesRented.rows.length == game.stockTotal) {
            return res.status(400).send("Todos as unidades do jogo escolhido já estão alugadas");
        }

        const today = dayjs().format('YYYY-MM-DD');
        const price = Number(daysRented) * Number(game.rows[0].pricePerDay);

        const rental = {
            customerId: customerId,
            gameId: gameId,
            rentDate: today,
            daysRented: daysRented,
            returnDate: null,
            originalPrice: price,
            delayFee: null
        };

        await db.query(`
            INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7);
            `, [rental.customerId, rental.gameId, rental.rentDate, rental.daysRented, rental.returnDate, rental.originalPrice, rental.delayFee]);

        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finalizeRental(req, res){
    const {id} = req.params;

    try {
        const rental1 = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        const rental = rental1.rows[0];
        if(!rental){
            return res.status(404).send("Essa rental não existe.");
        }
        if(rental.returnDate !== null){
            return res.status(400).send("Essa rental já foi finalizada.");
        }

        const returnDate = dayjs().format('YYYY-MM-DD');
        const nDays = calculateDaysDifference(rental.rentDate, returnDate);
        const delay = Math.abs(nDays - rental.daysRented);
        const delayFee = (nDays > rental.daysRented) ? delay * (rental.originalPrice / rental.daysRented) : 0 ;

        await db.query(`UPDATE RENTALS SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`, [returnDate, delayFee, id]);

        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}
function calculateDaysDifference(startDate, endDate) {
    const dateFormat = 'YYYY-MM-DD';
  
    // Converte as datas para o formato desejado (yyyy-mm-dd)
    const formattedStartDate = dayjs(startDate).format(dateFormat);
    const formattedEndDate = dayjs(endDate).format(dateFormat);
  
    // Calcula a diferença em dias entre as duas datas
    const daysDifference = dayjs(formattedEndDate).diff(formattedStartDate, 'day');
  
    return daysDifference;
}

export async function deleteRental(req, res){
    const {id} = req.params;

    try {
        const rental1 = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        const rental = rental1.rows[0];
        if(!rental){
            return res.status(404).send("Essa rental não existe.");
        }
        if(rental.returnDate == null){
            return res.status(400).send("Essa rental não foi finalizada.");
        }

        db.query(`DELETE FROM rentals WHERE id = $1;`, [id]);
        res.sendStatus(200);

    }catch (err) {
        res.status(500).send(err.message);
    }

}