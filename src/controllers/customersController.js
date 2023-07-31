import { db } from "../database/databaseConnection.js";
import dayjs from "dayjs";

/* clientes
    {
    id: 1,
    name: 'João Alfredo',
    phone: '21998899222',
    cpf: '01234567890',
    birthday: '1992-10-25'
    }
*/

export async function getCustomers(req, res){

    try{
        const customers = await db.query(`SELECT * FROM customers;`);
        const listCustomers = customers.rows.map((c) => {
            return {
                id: c.id,
                name: c.name,
                phone: c.phone,
                cpf: c.cpf,
                birthday: dayjs(c.birthday).format('YYYY-MM-DD')
            }
        })
        res.status(200).send(listCustomers);
    }catch (err) {
        res.status(500).send(err.message);
    }

}

export async function getCustomerById(req, res){

    const {id} = req.params;

    try{
        const customers = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        const customer = customers.rows.map((c) => {
            return {
                id: c.id,
                name: c.name,
                phone: c.phone,
                cpf: c.cpf,
                birthday: dayjs(c.birthday).format('YYYY-MM-DD')
            }
        })
        res.status(200).send(customer[0]);
    }catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postCustomer(req, res){
    const {name, phone, cpf, birthday} = req.body;

    try{
        const customer = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf]);
        if(customer.rows.length > 0){
            return res.status(409).send("O cliente já existe");
        }

        await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${name}', '${phone}', '${cpf}', '${birthday}');`);

        res.sendStatus(201);
    }catch (err) {
        res.status(500).send(err.message);
    }
}

export async function updateCustomer(req, res){

    const {id} = req.params;
    const {name, phone, cpf, birthday} = req.body;

    try{
        const customers = await db.query(`SELECT * FROM customers`);
        const verificarCpf = customers.rows.find((c) => c.cpf == cpf);
        if(verificarCpf){
            if(verificarCpf.id != id){
                return res.status(409).send("Cpf já cadastrado em outro cliente");
            }
        }
        
        await db.query(`UPDATE customers SET name='${name}', phone='${phone}', cpf='${cpf}', birthday='${birthday}' WHERE id=$1;`, [id]);
        res.sendStatus(200);
    }catch (err) {
        res.status(500).send(err.message);
    }
}