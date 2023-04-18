import { Enrollment, TicketType } from '@prisma/client';
import { noInputError, notFoundError } from '@/errors';
import paymentRepository from '@/repositories/payment-repository';

async function getAllTicketType() {
  const result = await paymentRepository.findAllTicketType();

  if (!result) throw notFoundError();

  return result;
}

async function getTicketByUser(userId: number) {
  const userIsEnrolled = await paymentRepository.findEnrollmentByUser(userId);

  if (!userIsEnrolled) throw notFoundError();

  const result = await paymentRepository.findUserTicket(userIsEnrolled.id);

  if (!result) throw notFoundError();

  return result;
}

async function createTicketForUser(ticketTypeId: number, userId: number) {
  if (!ticketTypeId) throw noInputError();

  const ticketType: TicketType = await paymentRepository.findTicketType(ticketTypeId);

  const enrollment: Enrollment = await paymentRepository.findEnrollment(userId);
  if (!enrollment) throw notFoundError();

  const createdTicket = await paymentRepository.createTicket(ticketType.id, enrollment.id);
  const sentTicket: createTicketForUser = {
    id: createdTicket.id,
    status: createdTicket.status,
    ticketTypeId: ticketTypeId,
    enrollmentId: enrollment.id,
    TicketType: {
      id: ticketTypeId,
      name: ticketType.name,
      price: ticketType.price,
      isRemote: ticketType.isRemote,
      includesHotel: ticketType.includesHotel,
      createdAt: ticketType.createdAt,
      updatedAt: ticketType.updatedAt,
    },
    createdAt: createdTicket.createdAt,
    updatedAt: createdTicket.updatedAt,
  };
  return sentTicket;
}

export type createTicketForUser = {
  id: number;
  status: string;
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

const paymentsService = {
  getAllTicketType,
  getTicketByUser,
  createTicketForUser,
};

export default paymentsService;
