import { Enrollment, Hotel, Ticket, TicketType } from '@prisma/client';
import { notFoundError, paymentRequiredError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getHotels(userId: number) {
  const enrollment: Enrollment = await hotelRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket: Ticket = await hotelRepository.findTicketByEnrollment(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const ticketType: TicketType = await hotelRepository.findTicketTypeByTicket(ticket.ticketTypeId);
  if (!ticketType.includesHotel || ticketType.isRemote) throw paymentRequiredError();

  const result: Hotel[] = await hotelRepository.findAllHotels();
  if (!result) throw notFoundError();

  return result;
}

async function getHotelRooms(userId: number, hotelId: number) {
  const enrollment: Enrollment = await hotelRepository.findEnrollmentByUserId(userId);
  if (!enrollment) throw notFoundError();

  const hotel: Hotel = await hotelRepository.findHotelById(hotelId);
  if (!hotel) throw notFoundError();

  const ticket: Ticket = await hotelRepository.findTicketByEnrollment(enrollment.id);
  if (!ticket) throw notFoundError();
  if (ticket.status !== 'PAID') throw paymentRequiredError();

  const ticketType: TicketType = await hotelRepository.findTicketTypeByTicket(ticket.ticketTypeId);
  if (!ticketType.includesHotel || ticketType.isRemote) throw paymentRequiredError();

  const result: HotelWithRooms = await hotelRepository.findAllHotelRooms(hotelId);
  if (!result) throw notFoundError();

  return result;
}

export type HotelWithRooms = {
  id: number;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  Rooms: RoomList[];
};

export type RoomList = {
  id: number;
  name: string;
  capacity: number;
  hotelId: number;
  createdAt: string;
  updatedAt: string;
};

const hotelsService = {
  getHotels,
  getHotelRooms,
};

export default hotelsService;
