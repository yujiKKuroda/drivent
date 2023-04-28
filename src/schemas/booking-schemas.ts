import Joi from 'joi';

export const createBookingSchema = Joi.object({
  roomId: Joi.number().integer().min(1).required(),
});
