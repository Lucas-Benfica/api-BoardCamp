import Joi from "joi";

export const schemaCustomers = Joi.object({
    name: Joi.string().required().min(1),
    phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    birthday: Joi.date().iso().required()
});

/*
Para o campo name, usamos .required().min(1) para garantir que o nome seja obrigatório e tenha pelo menos um caractere.

Para o campo phone, usamos .pattern(/^[0-9]{10,11}$/) para garantir que o telefone contenha apenas dígitos e tenha 10 ou 11 caracteres numéricos.

Para o campo cpf, usamos .length(11) para garantir que o CPF tenha exatamente 11 caracteres numéricos e .pattern(/^[0-9]+$/) para garantir que contenha apenas dígitos.

Para o campo birthday, usamos .date().iso() para garantir que seja uma data válida no formato ISO (por exemplo, "1990-01-01").
*/