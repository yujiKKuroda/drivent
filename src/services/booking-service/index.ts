import { Booking, Room, Ticket, TicketType } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getBookingByUserId(userId: number) {
  const result = await bookingRepository.getBookingByUserId(userId);

  if (!result) throw notFoundError();

  return result;
}

async function createBookingForUser(roomId: number, userId: number): Promise<Booking> {
  const ticket: Ticket = await bookingRepository.findTicketByUserId(userId);
  if (ticket.status !== 'PAID') throw forbiddenError();

  const ticketType: TicketType = await bookingRepository.findTicketTypeByTicket(ticket.ticketTypeId);
  if (ticketType.isRemote || !ticketType.includesHotel) throw forbiddenError();

  const room: Room = await bookingRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const roomBookingList: Booking[] = await bookingRepository.findAllRooms(roomId);
  if (roomBookingList.length <= room.capacity) throw forbiddenError();

  return await bookingRepository.createBooking(roomId, userId);
}

const bookingService = {
  createBookingForUser,
  getBookingByUserId,
};

export default bookingService;
