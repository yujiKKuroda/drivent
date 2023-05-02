import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createBooking,
  createEnrollmentWithAddress,
  createSpecificTicketType,
  createTicket,
  createUser,
  createHotel,
  createRoom,
  createRoomWithLessCapacity,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 if there is no booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if user ticket is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(true, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: room.id };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, false);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: room.id };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if user ticket was not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: room.id };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if room does not have a spot', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoomWithLessCapacity(hotel.id);
      await createBooking(user.id, room.id);

      const body = { roomId: room.id };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if room does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const body = { roomId: 1 };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const body = { roomId: room.id };
      const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.OK);
      const booking = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.body).toEqual({ bookingId: booking.body.id });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.put('/booking/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 403 if booking does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoomWithLessCapacity(hotel.id);
      await createBooking(user.id, room.id);

      const body = { roomId: room.id };
      const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if room does not have a spot', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoomWithLessCapacity(hotel.id);
      await createBooking(user.id, room.id);

      const body = { roomId: room.id };
      const response = await server.put(`/booking/${room.id}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if room does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const body = { roomId: 1 };
      const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 and booking id', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createSpecificTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const hotel = await createHotel();
      const room = await createRoom(hotel.id);
      const booking = await createBooking(user.id, room.id);

      const body = { roomId: room.id };
      const response = await server.put(`/booking${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual(booking.id);
    });
  });
});
