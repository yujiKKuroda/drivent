import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  ticketId: Joi.number().integer().min(1).required(),
  cardData: Joi.object({
    issuer: Joi.string().required(),
    number: Joi.number().integer().required(),
    name: Joi.string().required(),
    expirationDate: Joi.date().required(),
    cvv: Joi.number().integer().required(),
  }).required(),
});
