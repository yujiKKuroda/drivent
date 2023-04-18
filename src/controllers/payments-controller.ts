import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPaymentInfoFromTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const ticketId: number = parseInt(req.query.ticketId as string);

  try {
    const paymentList = await paymentsService.getPaymentByTicketId(ticketId, userId);

    return res.status(httpStatus.OK).send(paymentList);
  } catch (error) {
    if (error.name === 'noInputError') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    } else if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}

export async function payTicket(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const response = await paymentsService.payUserTicket(req.body, userId);
    return res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    if (error.name === 'noInputError') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    } else if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'UnauthorizedError') {
      return res.sendStatus(httpStatus.UNAUTHORIZED);
    }
  }
}
