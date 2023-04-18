import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPaymentInfoFromTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypeList = await paymentsService.getAllTicketType();
    return res.status(httpStatus.OK).send(ticketTypeList);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function payTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const response = await paymentsService.createTicketForUser(req.body.ticketTypeId, req.userId);
    return res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    if (error.name === 'noInputError') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
