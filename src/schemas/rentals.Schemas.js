import Joi from "joi";

export const schemaRentals = Joi.object({
    customerId: Joi.number().integer().positive().required(),
    gameId: Joi.number().integer().positive().required(),   
    daysRented: Joi.number().integer().positive().required(),
});