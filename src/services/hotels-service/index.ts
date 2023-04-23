import { notFoundError } from '@/errors';
import hotelRepository from '@/repositories/hotel-repository';

async function getHotels() {
  const result = await hotelRepository.findAllHotels();

  if (!result) throw notFoundError();

  return result;
}

const hotelsService = {
  getHotels,
};

export default hotelsService;
