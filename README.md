# Flight Booking Service

## Table of Contents
- [Description](#description)
- [Key Functionalities](#key-functionalities)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Related Microservices](#related-microservices)

## Description

**Flight Booking Service** is a **microservice** that is part of a larger **flight booking application**. This service is responsible for managing flight bookings, cancellations, and payments. It includes payment processing to confirm bookings and publishes booking data via RabbitMQ integration for notification purposes.

## Key Functionalities

### Booking Management
- **Create Booking**: `POST /` - Handles the creation of a new flight booking.
- **Make Payment**: `POST /payments` - Processes payments for flight bookings.

### Additional Features
- **RabbitMQ Integration**: Publishes successful booking data to the notification service, which then sends confirmation emails to users.
- **CRON Jobs**: Automatically cancels bookings if payment is not received within 5 minutes.

## Technologies Used

- **Node.js** - JavaScript runtime for building scalable network applications.
- **Express.js** - Web application framework for Node.js.
- **MySQL** - Relational database management system.
- **Sequelize** - Promise-based Node.js ORM for MySQL.
- **dotenv** - Module to load environment variables from a `.env` file.
- **amqplib** - RabbitMQ client library for Node.js.
- **axios** - Promise-based HTTP client for making requests.
- **node-cron** - Scheduler for running tasks at specific intervals.
- **nodemon** - Utility to automatically restart the server on file changes during development.
- **winston** - Logger for handling logging.

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ShubhamYv/flight-booking-service.git
   cd flight-booking-service
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create a `.env` file**

   Copy the `.env.example` file to `.env` and add the necessary environment variables:

   **Example `.env` file:**

   ```env
   PORT=3001
   FLIGHT_SERVICE=<Flight Service URL>
   FLIGHT_API_GATEWAY=<API Gateway URL>
   ACTIVEMQ_URL='amqp://localhost'
   ACTIVEMQ_CHANNEL=<Your RabbitMQ Channel>
   
   COMPANY_NAME='Your Company Name'
   CONTACT_INFORMATION='support@yourcompany.com'
   WEBSITE_URL='https://yourcompany.com'
   ```

4. **Start the server**

   ```bash
   npm run dev
   ```

   The server will run on the port specified in the `.env` file (default is 3001).

## Related Microservices

Explore other microservices in the Skybook Flight Ecosystem:

1. **Flight Services**: Manages airplanes, airports, cities, and flights.
   - [Flight Services Repository](https://github.com/ShubhamYv/flight-service)

2. **Flight API Gateway**: Routes requests and balances load across services.
   - [Flight API Gateway Repository](https://github.com/ShubhamYv/flight-api-gateway)

3. **Flight Notification Service**: Sends real-time flight updates and notifications.
   - [Flight Notification Service Repository](https://github.com/ShubhamYv/flight-notification-service)

Together, these services ensure a seamless flight booking experience!

--- 

This README provides an overview of the **Flight Booking Service** and guides users on how to set it up and explore related microservices.
