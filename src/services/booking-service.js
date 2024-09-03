const axios = require('axios')
const { BookingRepository } = require('../repositories');
const db = require('../models');
const { ServerConfig, QueueConfig } = require('../config/');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { Enums } = require('../utils/common');
const EMAIL_TEMPLATES = require('../utils/common/email-template');

const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`);
    const flightData = flight.data.data;
    if (data.noOfSeats > flightData.totalSeats) {
      throw new AppError('Not enough seats available', StatusCodes.BAD_REQUEST);
    }
    const totalBillingAmount = data.noOfSeats * flightData.price;
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.create(bookingPayload, transaction);

    await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`, {
      seats: data.noOfSeats
    });
    await transaction.commit();
    return booking;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingId = data.bookingId;
    const bookingDetails = await bookingRepository.get(bookingId, transaction);

    if (!bookingDetails) {
      throw new AppError('Booking not found', StatusCodes.NOT_FOUND);
    }

    if (bookingDetails.status === CANCELLED) {
      throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
    }

    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();

    if (currentTime - bookingTime > 300000) {
      await cancelBooking(data.bookingId);
      throw new AppError('The booking has expired', StatusCodes.BAD_REQUEST);
    }

    if (bookingDetails.totalCost !== data.totalCost) {
      throw new AppError('The amount of the payment does not match', StatusCodes.BAD_REQUEST);
    }

    if (bookingDetails.userId !== data.userId) {
      throw new AppError('The user corresponding to the booking does not match', StatusCodes.BAD_REQUEST);
    }

    // Assume that payment is successful 
    await bookingRepository.update(data.bookingId, { status: BOOKED }, transaction);

    const flightResponse = await axios.get(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}`);
    const flightData = flightResponse.data.data;
    const userId = await getUserIdByBookingId(data.bookingId);
    const userDetails = await getUserDetailsByUserId(userId);

    // Send email notification
    await QueueConfig.sendData({
      recipientEmail: userDetails.data.email,
      subject: EMAIL_TEMPLATES.EMAIL_SUBJECT(flightData.flightNumber),
      text: EMAIL_TEMPLATES.BOOKING_CONFIRMATION_TEXT(data.bookingId, flightData),
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function getUserDetailsByUserId(userId) {
  try {
    const response = await axios.get(`${ServerConfig.FLIGHT_API_GATEWAY}/api/v1/user/${userId}`);
    return response.data;
  } catch (error) {
    throw new AppError('Unable to retrieve user details at this time.', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getUserIdByBookingId(bookingId) {
  try {
    const booking = await bookingRepository.get(bookingId);
    return booking.userId;
  } catch (error) {
    throw error;
  }
}

async function cancelBooking(bookingId) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(bookingId, transaction);
    if (bookingDetails.status == CANCELLED) {
      await transaction.commit();
      return true;
    }
    await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}/seats`, {
      seats: bookingDetails.noOfSeats,
      dec: 0
    });
    await bookingRepository.update(bookingId, { status: CANCELLED }, transaction);
    await transaction.commit();

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

async function cancelOldBookings() {
  try {
    const time = new Date(Date.now() - 1000 * 300);
    const response = await bookingRepository.cancelOldBookings(time);
    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createBooking,
  makePayment,
  cancelOldBookings,
  getUserIdByBookingId,
}