import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBookingByUserId(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {
  } catch (error) {}
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  try {
  } catch (error) {}
}
