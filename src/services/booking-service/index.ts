import { notFoundError } from '@/errors';
import bookingRepository from '@/repositories/booking-repository';

async function getBookingByUserId(userId: number) {
  const result = await bookingRepository.getBookingByUserId(userId);

  if (!result) throw notFoundError();

  return result;
}

const bookingService = {
  getBookingByUserId,
};

export default bookingService;
