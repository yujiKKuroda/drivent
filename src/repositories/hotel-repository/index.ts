import { prisma } from '@/config';

async function findAllHotels() {
  return await prisma.hotel.findMany();
}

const hotelRepository = {
  findAllHotels,
};

export default hotelRepository;
