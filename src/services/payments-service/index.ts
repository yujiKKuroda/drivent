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

const paymentsService = {
  getPaymentByTicketId,
};

export default paymentsService;
