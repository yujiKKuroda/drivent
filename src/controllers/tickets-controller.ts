import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketTypeList = await ticketsService.getAllTicketType();
    return res.status(httpStatus.OK).send(ticketTypeList);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getTicketsByUser(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketList = await ticketsService.getTicketByUser(req.userId);
    return res.status(httpStatus.OK).send(ticketList);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const response = await ticketsService.createTicketForUser(req.body.ticketTypeId, req.userId);
    return res.status(httpStatus.CREATED).send(response);
  } catch (error) {
    if (error.name === 'noInputError') {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (error.name === 'notFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}
