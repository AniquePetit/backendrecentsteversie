// In bookings.js
import express from 'express';
import * as bookingService from '../services/bookingService.js';

const router = express.Router();

// ✅ Haal alle boekingen op
router.get('/', async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen van boekingen' });
  }
});

// ✅ Maak een nieuwe boeking aan
router.post('/', async (req, res) => {
  try {
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

    // Log de ontvangen body voor debugging
    console.log('Ontvangen body:', req.body);

    // Validatie van de velden
    if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests || !totalPrice || !bookingStatus) {
      return res.status(400).json({ message: 'Alle velden zijn verplicht' });
    }

    // Parse de datums
    const parsedCheckInDate = new Date(checkinDate);
    const parsedCheckOutDate = new Date(checkoutDate);

    if (isNaN(parsedCheckInDate.getTime()) || isNaN(parsedCheckOutDate.getTime())) {
      return res.status(400).json({ message: 'Ongeldige datums' });
    }

    // Controleer of het totaalbedrag een geldig getal is
    if (isNaN(totalPrice) || totalPrice <= 0) {
      return res.status(400).json({ message: 'Totaalbedrag moet een geldig getal zijn' });
    }

    // Maak de boeking aan
    const newBooking = await bookingService.createBooking({
      userId,
      propertyId,
      checkInDate: parsedCheckInDate,
      checkOutDate: parsedCheckOutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij aanmaken van boeking' });
  }
});

export default router; // Dit zorgt voor de default export
