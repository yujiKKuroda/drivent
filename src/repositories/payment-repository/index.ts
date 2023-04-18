import { prisma } from '@/config';

async function findEnrollmentById(id: number) {
  return await prisma.enrollment.findUnique({
    where: {
      id: id,
    },
  });
}

async function findTicketById(id: number) {
  return await prisma.ticket.findUnique({
    where: {
      id: id,
    },
  });
}

async function getPaymentInfo(ticketId: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
}

const paymentRepository = {
  findEnrollmentById,
  findTicketById,
  getPaymentInfo,
};

export default paymentRepository;
