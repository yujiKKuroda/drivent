import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getPaymentInfoFromTicket, payTicket } from '@/controllers';
import { createPaymentSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getPaymentInfoFromTicket)
  .post('/process', validateBody(createPaymentSchema), payTicket);

export { ticketsRouter };
