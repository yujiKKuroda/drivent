import { Booking, Enrollment, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotels() {
  return await prisma.hotel.findMany();
}

async function findBooking(userId: number): Promise<Booking> {
  return await prisma.booking.findFirst({
    where: {
      userId: userId,
    },
  });
}

async function findEnrollmentByUserId(userId: number): Promise<Enrollment> {
  return await prisma.enrollment.findFirst({
    where: {
      userId: userId,
    },
  });
}

async function findTicketByEnrollment(enrollmentId: number): Promise<Ticket> {
  return await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollmentId,
    },
  });
}

async function findTicketTypeByTicket(ticketTypeId: number): Promise<TicketType> {
  return await prisma.ticketType.findUnique({
    where: {
      id: ticketTypeId,
    },
  });
}

const hotelRepository = {
  findAllHotels,
  findBooking,
  findEnrollmentByUserId,
  findTicketByEnrollment,
  findTicketTypeByTicket,
};

export default hotelRepository;
