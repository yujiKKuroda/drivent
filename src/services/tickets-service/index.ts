import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getAllTicketType() {
  const result = await ticketRepository.findAllTicketType();

  if (!result) throw notFoundError();

  return result;
}

async function getTicketByUser(userId: number) {
  const userIsEnrolled = await ticketRepository.findUserEnrollment(userId);

  if (!userIsEnrolled) throw notFoundError();

  const result = await ticketRepository.findUserTicket(userIsEnrolled.id);

  if (!result) throw notFoundError();

  return result;
}

const ticketsService = {
  getAllTicketType,
  getTicketByUser,
};

export default ticketsService;
