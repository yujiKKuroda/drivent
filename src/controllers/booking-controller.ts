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
    const response = await bookingService.createBookingForUser(req.body.roomId, req.userId);
    return res.status(httpStatus.OK).send(response.id);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'forbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const { roomId } = req.body;
  const bookingId: number = parseInt(req.params.bookingId as string);

  try {
    const response = await bookingService.changeBookingForUser(roomId, bookingId);
    return res.status(httpStatus.OK).send(response.id);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.sendStatus(httpStatus.NOT_FOUND);
    } else if (error.name === 'forbiddenError') {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }
  }
}
