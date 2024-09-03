const amqplib = require('amqplib');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const ServerConfig = require('./server-config');

let connection;
let channel;

async function connectQueue() {
  try {
    connection = await amqplib.connect(ServerConfig.ACTIVEMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(ServerConfig.ACTIVEMQ_CHANNEL);
  } catch (error) {
    throw AppError("Failed to connect to RabbitMQ", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function sendData(data) {
  try {
    await channel.sendToQueue(ServerConfig.ACTIVEMQ_CHANNEL, Buffer.from(JSON.stringify(data)));
  } catch (error) {
    throw AppError("Failed to send message to queue", StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  connectQueue,
  sendData,
}