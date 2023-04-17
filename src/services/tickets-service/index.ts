import { notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getAllTicketType() {
  const result = await ticketRepository.findAllTicketType();

  if (!result) throw notFoundError();

  return result;
}

const ticketsService = {
  getAllTicketType,
};

export default ticketsService;
