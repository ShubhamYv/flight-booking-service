const EMAIL_TEMPLATES = {
  BOOKING_CONFIRMATION_TEXT: (bookingId, flightDetails) => `
    Dear User,

    Congratulations! Your flight booking has been successfully processed.

    Booking Details:
    - Booking ID: ${bookingId}
    - Flight Number: ${flightDetails.flightNumber}
    - Date: ${new Date(flightDetails.departureTime).toLocaleDateString()}
    - Departure: ${new Date(flightDetails.departureTime).toLocaleTimeString()}
    - Arrival: ${new Date(flightDetails.arrivalTime).toLocaleTimeString()}

    Thank you for choosing our service. We wish you a pleasant journey!

    If you have any questions or need further assistance, feel free to contact our support team.

    Best regards,
    The Flight Booking Team
    ${process.env.COMPANY_NAME}
    ${process.env.CONTACT_INFORMATION}
    ${process.env.WEBSITE_URL}
  `,
  EMAIL_SUBJECT: (flightNumber) => `
    Flight Booking Confirmation - Flight Number: ${flightNumber}
  `,
};

module.exports = EMAIL_TEMPLATES;
