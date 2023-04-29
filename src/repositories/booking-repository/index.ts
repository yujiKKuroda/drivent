import { prisma } from '@/config';

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
  getBookingByUserId,
};

export default bookingRepository;
