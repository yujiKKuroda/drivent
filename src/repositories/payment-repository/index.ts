import { Payment } from '@prisma/client';
import { prisma } from '@/config';

async function findEnrollmentById(id: number) {
  return await prisma.enrollment.findUnique({
    where: {
      id: id,
    },
  });
}

async function findEnrollmentByUserId(userId: number) {
  return await prisma.enrollment.findFirst({
    where: {
      userId: userId,
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

async function postPayment(ticketId: number, card: cardData): Promise<Payment> {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: ticketId,
    },
  });

  await prisma.ticket.update({
    where: {
      id: ticketId,
    },
    data: {
      status: 'PAID',
    },
  });

  const ticketType = await prisma.ticketType.findUnique({
    where: {
      id: ticket.ticketTypeId,
    },
  });

  return await prisma.payment.create({
    data: {
      ticketId: ticketId,
      value: ticketType.price,
      cardIssuer: card.issuer,
      cardLastDigits: card.number.toString().slice(-4),
    },
  });
}

export type cardData = {
  issuer: string;
  number: number;
  name: string;
  expirationDate: Date;
  cvv: number;
};

const paymentRepository = {
  findEnrollmentById,
  findEnrollmentByUserId,
  findTicketById,
  getPaymentInfo,
  postPayment,
};

export default paymentRepository;
