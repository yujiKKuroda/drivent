import Joi from 'joi';

export const createTicketSchema = Joi.object({
  ticketTypeId: Joi.number().integer().min(1).required(),
});
