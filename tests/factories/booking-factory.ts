import faker from '@faker-js/faker';

import { prisma } from '@/config';

export async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      userId: userId,
      roomId: roomId,
    },
  });
}

export async function createRoomWithLessCapacity(hotelId: number) {
  return prisma.room.create({
    data: {
      name: faker.company.companyName(),
      capacity: 1,
      hotelId: hotelId,
    },
  });
}
