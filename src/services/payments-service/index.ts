import { noInputError, notFoundError, unauthorizedError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

async function getPaymentByTicketId(ticketId: number, userId: number) {
  if (!ticketId) throw noInputError();

  const ticket = await paymentRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await paymentRepository.findEnrollmentById(ticket.enrollmentId);
  if (enrollment.userId !== userId) throw unauthorizedError();

  const result = await paymentRepository.getPaymentInfo(ticketId);

  return result;
}

async function payUserTicket(body: PaymentBody, userId: number) {
  if (!body || !body.cardData) throw noInputError();

  const ticket = await paymentRepository.findTicketById(body.ticketId);
  if (!ticket) throw notFoundError();

  const enrollment = await paymentRepository.findEnrollmentByUserId(userId);
  if (!enrollment.userId) throw unauthorizedError();
}

export type PaymentBody = {
  ticketId: number;
  cardData: {
    issuer: string;
    number: number;
    name: string;
    expirationDate: Date;
    cvv: number;
  };
};

const paymentsService = {
  getPaymentByTicketId,
  payUserTicket,
};

export default paymentsService;
