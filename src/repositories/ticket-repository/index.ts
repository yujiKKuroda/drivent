import { prisma } from '@/config';

async function findAllTicketType() {
  return await prisma.ticketType.findMany();
}

async function findUserEnrollment(id: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId: id,
    },
    select: {
      id: true,
    },
  });
}

async function findUserTicket(id: number) {
  console.log('cheguei!');
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId: id,
    },
    include: {
      TicketType: true,
    },
  });
}

const ticketRepository = {
  findAllTicketType,
  findUserEnrollment,
  findUserTicket,
};

export default ticketRepository;
