import { Booking, Enrollment, Room, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function changeBooking(roomId: number, bookingId: number) {
  return await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
    },
  });
}

async function createBooking(roomId: number, userId: number) {
  return await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

async function findAllRooms(roomId: number) {
  return await prisma.booking.findMany({
    where: {
      roomId: roomId,
    },
  });
}

async function findBookingById(bookingId: number): Promise<Booking> {
  return await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
  });
}

async function findRoom(roomId: number): Promise<Room> {
  return await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

async function findTicketByUserId(userId: number): Promise<Ticket> {
  const enrollment: Enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: userId,
    },
  });

  return await prisma.ticket.findFirst({
    where: {
      enrollmentId: enrollment.id,
    },
  });
}

async function findTicketTypeByTicket(ticketTypeId: number): Promise<TicketType> {
  return await prisma.ticketType.findFirst({
    where: {
      id: ticketTypeId,
    },
  });
}

async function getBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId: userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

const bookingRepository = {
  changeBooking,
  createBooking,
  findAllRooms,
  findBookingById,
  findRoom,
  findTicketByUserId,
  findTicketTypeByTicket,
  getBookingByUserId,
};

export default bookingRepository;
