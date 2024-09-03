const dotenv = require('dotenv')

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  FLIGHT_SERVICE: process.env.FLIGHT_SERVICE,
  ACTIVEMQ_URL: process.env.ACTIVE_MQ_URL,
  ACTIVEMQ_CHANNEL: process.env.ACTIVEMQ_CHANNEL,
  FLIGHT_API_GATEWAY: process.env.FLIGHT_API_GATEWAY,
}