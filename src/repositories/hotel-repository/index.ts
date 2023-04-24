import { Enrollment, Hotel, Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findAllHotelRooms(hotelId: number): Promise<HotelWithRooms> {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id: hotelId,
    },
  });

  const rooms = await prisma.room.findMany({
    where: {
      hotelId: hotelId,
    },
  });

  const roomList = rooms.map((room) => {
    return {
      id: room.id,
      name: room.name,
      capacity: room.capacity,
      hotelId: room.hotelId,
      createdAt: room.createdAt.toISOString(),
      updatedAt: room.updatedAt.toISOString(),
    };
  });

  return {
    id: hotel.id,
    name: hotel.name,
    image: hotel.image,
    createdAt: hotel.createdAt.toISOString(),
    updatedAt: hotel.updatedAt.toISOString(),
    Rooms: roomList,
  };
}

async function findAllHotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
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

const hotelRepository = {
  findAllHotelRooms,
  findAllHotels,
  findEnrollmentByUserId,
  findHotelById,
  findTicketByEnrollment,
  findTicketTypeByTicket,
};

export default hotelRepository;
