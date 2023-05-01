import { Booking, Enrollment, Room, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function createBooking(roomId: number, userId: number): Promise<Booking> {
  return await prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

async function findAllRooms(roomId: number): Promise<Booking[]> {
  return await prisma.booking.findMany({
    where: {
      roomId: roomId,
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
  createBooking,
  findAllRooms,
  findRoom,
  findTicketByUserId,
  findTicketTypeByTicket,
  getBookingByUserId,
};

export default bookingRepository;
