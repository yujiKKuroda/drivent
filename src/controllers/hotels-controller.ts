import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const hotelsList = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotelsList);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  try {
  } catch (error) {}
}
