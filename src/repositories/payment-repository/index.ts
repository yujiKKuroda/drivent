import { prisma } from '@/config';

async function createTicket(ticketTypeId: number, enrollmentId: number) {
  return await prisma.ticket.create({
    data: {
      ticketTypeId: ticketTypeId,
      enrollmentId: enrollmentId,
      status: 'RESERVED',
    },
  });
}

async function findAllTicketType() {
  return await prisma.ticketType.findMany();
}

async function findEnrollment(id: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId: id,
    },
  });
}

async function findEnrollmentByUser(id: number) {
  return await prisma.enrollment.findUnique({
    where: {
      userId: id,
    },
    select: {
      id: true,
    },
  });
}

async function findTicketType(id: number) {
  return await prisma.ticketType.findUnique({
    where: {
      id: id,
    },
  });
}

async function findUserTicket(id: number) {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId: id,
    },
    include: {
      TicketType: true,
    },
  });
}

const paymentRepository = {
  createTicket,
  findAllTicketType,
  findEnrollment,
  findEnrollmentByUser,
  findTicketType,
  findUserTicket,
};

export default paymentRepository;
