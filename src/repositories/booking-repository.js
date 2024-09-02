const CrudRepository = require("./crud-repository");
const { Booking } = require('../models');
const { Op } = require("sequelize");
const { Enums } = require('../utils/common');
const { CANCELLED, BOOKED } = Enums.BOOKING_STATUS;

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking)
  }

  async createBooking(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    return response;
  }

  async get(data, transaction) {
    const response = await Booking.findByPk(data, { transaction: transaction });
    if (!response) {
      throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async update(id, data, transaction) {
    const response = await Booking.update(data, {
      where: {
        id: id
      }
    }, { transaction: transaction });
    return response;
  }

  async cancelOldBookings(timestamp) {
    const response = await Booking.update({ status: CANCELLED }, {
      where: {
        [Op.and]: [
          {
            createdAt: {
              [Op.lt]: timestamp
            }
          },
          {
            status: {
              [Op.ne]: BOOKED
            }
          },
          {
            status: {
              [Op.ne]: CANCELLED
            }
          }
        ]

      }
    });
    return response;
  }
}

module.exports = BookingRepository;