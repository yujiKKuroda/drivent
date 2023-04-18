import { Enrollment, TicketType } from '@prisma/client';
import { noInputError, notFoundError } from '@/errors';
import ticketRepository from '@/repositories/ticket-repository';

async function getAllTicketType() {
  const result = await ticketRepository.findAllTicketType();

  if (!result) throw notFoundError();

  return result;
}

async function getTicketByUser(userId: number) {
  const userIsEnrolled = await ticketRepository.findEnrollmentByUser(userId);

  if (!userIsEnrolled) throw notFoundError();

  const result = await ticketRepository.findUserTicket(userIsEnrolled.id);

  if (!result) throw notFoundError();

  return result;
}

async function createTicketForUser(ticketTypeId: number, userId: number) {
  if (!ticketTypeId) throw noInputError();

  const ticketType: TicketType = await ticketRepository.findTicketType(ticketTypeId);

  const enrollment: Enrollment = await ticketRepository.findEnrollment(userId);
  if (!enrollment) throw notFoundError();

  const createdTicket = await ticketRepository.createTicket(ticketType.id, enrollment.id);
  const sentTicket: createTicketForUser = {
    id: createdTicket.id,
    status: createdTicket.status,
    ticketTypeId: ticketTypeId,
    enrollmentId: userId,
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

const ticketsService = {
  getAllTicketType,
  getTicketByUser,
  createTicketForUser,
};

export default ticketsService;
