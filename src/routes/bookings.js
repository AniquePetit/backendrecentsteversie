import express from 'express';
import * as bookingService from '../services/bookingService.js'; // Named import gebruiken
// Import de authMiddleware als je die wilt gebruiken
// import authMiddleware from '../middleware/authMiddleware.js';

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

// ✅ Haal een specifieke boeking op
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Ongeldige boeking ID' });

    const booking = await bookingService.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Boeking niet gevonden' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen van boeking' });
  }
});

// ✅ Maak een nieuwe boeking aan
router.post('/', async (req, res) => {
  try {
    const { userId, propertyId, checkIn, checkOut, guestCount } = req.body;

    if (!userId || !propertyId || !checkIn || !checkOut || !guestCount) {
      return res.status(400).json({ message: 'Alle velden zijn verplicht' });
    }

    // Verzend de boeking naar de service voor creatie
    const newBooking = await bookingService.createBooking(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij aanmaken van boeking' });
  }
});

// ✅ Update een bestaande boeking
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Ongeldige boeking ID' });

    const { userId, propertyId, checkIn, checkOut, guestCount } = req.body;

    if (!userId || !propertyId || !checkIn || !checkOut || !guestCount) {
      return res.status(400).json({ message: 'Alle velden zijn verplicht' });
    }

    const updatedBooking = await bookingService.updateBooking(id, req.body);
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Boeking niet gevonden of geen rechten' });
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij updaten van boeking' });
  }
});

// ✅ Verwijder een boeking
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Ongeldige boeking ID' });

    const deleted = await bookingService.deleteBooking(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Boeking niet gevonden of geen rechten' });
    }

    res.json({ message: 'Boeking verwijderd' });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij verwijderen van boeking' });
  }
});

// Exporteer de router
export default router;
