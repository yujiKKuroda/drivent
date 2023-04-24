import { Booking, Enrollment, Hotel, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotels(): Promise<Hotel[]> {
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

async function findHotelById(hotelId: number): Promise<Hotel> {
  return await prisma.hotel.findUnique({
    where: {
      id: hotelId,
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
  findHotelById,
  findTicketByEnrollment,
  findTicketTypeByTicket,
};

export default hotelRepository;
