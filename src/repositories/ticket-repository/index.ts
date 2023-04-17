import { prisma } from '@/config';

async function findAllTicketType() {
  return prisma.ticketType.findMany();
}

const ticketRepository = {
  findAllTicketType,
};

export default ticketRepository;
