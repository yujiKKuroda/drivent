import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketTypes, getTicketsByUser, createTicket } from '@/controllers';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .get('/types', getTicketTypes)
  .all('/*', authenticateToken)
  .get('/', getTicketsByUser)
  .post('/', validateBody(createTicketSchema), createTicket);

export { ticketsRouter };
