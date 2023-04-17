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
  } catch (error) {}
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
  try {
  } catch (error) {}
}
