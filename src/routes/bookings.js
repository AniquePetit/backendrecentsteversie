import express from 'express';
import * as bookingService from '../services/bookingService.js';

const router = express.Router();

// ✅ Haal alle boekingen op
router.get('/', async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen van boekingen', error: error.message });
  }
});

// ✅ Maak een nieuwe boeking aan
router.post('/', async (req, res) => {
  try {
    const { userId, propertyId, checkinDate, checkoutDate, numberOfGuests, totalPrice } = req.body;

    console.log('Ontvangen body:', req.body); // Log de ontvangen body

    // Controleer of alle velden aanwezig zijn
    if (!userId || !propertyId || !checkinDate || !checkoutDate || !numberOfGuests || !totalPrice) {
      return res.status(400).json({ message: 'Alle velden zijn verplicht' });
    }

    // Maak de boeking aan
    const newBooking = await bookingService.createBooking({
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij aanmaken van boeking', error: error.message });
  }
});

// ✅ Werk een bestaande boeking bij (PUT)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { checkinDate, checkoutDate, numberOfGuests, totalPrice, bookingStatus } = req.body;

    console.log('Ontvangen body voor update:', req.body);

    // Werk de boeking bij
    const updatedBooking = await bookingService.updateBooking(id, {
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij bijwerken van boeking', error: error.message });
  }
});

// ✅ Verwijder een boeking (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Controleer of de ID een geldige UUID is (optioneel)
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) {
      return res.status(400).json({ message: 'Ongeldige ID' });
    }

    const result = await bookingService.deleteBooking(id);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij verwijderen van boeking', error: error.message });
  }
});

export default router;
