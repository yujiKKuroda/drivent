import { Booking, Room, Ticket, TicketType } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getBookingByUserId(userId: number) {
  const result = await bookingRepository.getBookingByUserId(userId);
  if (!result) throw notFoundError();

  return result;
}

async function createBookingForUser(roomId: number, userId: number) {
  const ticket: Ticket = await bookingRepository.findTicketByUserId(userId);
  if (ticket.status !== 'PAID') throw forbiddenError();

  const ticketType: TicketType = await bookingRepository.findTicketTypeByTicket(ticket.ticketTypeId);
  if (ticketType.isRemote || !ticketType.includesHotel) throw forbiddenError();

  const room: Room = await bookingRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const bookingList = await bookingRepository.findAllRooms(roomId);
  if (bookingList.length >= room.capacity) throw forbiddenError();

  const booking = await bookingRepository.createBooking(roomId, userId);
  return booking;
}

async function changeBookingForUser(roomId: number, bookingId: number) {
  const booking: Booking = await bookingRepository.findBookingById(bookingId);
  if (!booking) throw forbiddenError();

  const room: Room = await bookingRepository.findRoom(roomId);
  if (!room) throw notFoundError();

  const bookingList: Booking[] = await bookingRepository.findAllRooms(roomId);
  if (bookingList.length >= room.capacity) throw forbiddenError();

  const bookingUpdated = await bookingRepository.changeBooking(roomId, bookingId);
  return bookingUpdated;
}

const bookingService = {
  getBookingByUserId,
  createBookingForUser,
  changeBookingForUser,
};

export default bookingService;
