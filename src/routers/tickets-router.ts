import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketTypes, getTicketsByUser, createTicket } from '@/controllers';
import { createTicketSchema } from '@/schemas';

const paymentsRouter = Router();

paymentsRouter
  .all('/*', authenticateToken)
  .get('/types', getTicketTypes)
  .get('/', getTicketsByUser)
  .post('/', validateBody(createTicketSchema), createTicket);

export { paymentsRouter };
