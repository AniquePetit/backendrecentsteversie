import express from 'express';
import { getAllReviews, getReviewById, createReview } from '../services/reviewService.js';

const router = express.Router();

// ✅ Haal alle reviews op
router.get('/', async (req, res) => {
  try {
    const reviews = await getAllReviews();  // Haalt alle reviews op via de service
    res.json(reviews);  // Retourneer de lijst van reviews als JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij ophalen van reviews' });  // Foutmelding bij het ophalen van reviews
  }
});

// ✅ Haal een specifieke review op via ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);  // Verkrijg het review ID uit de URL parameter
    if (isNaN(id)) return res.status(400).json({ message: 'Ongeldig ID' });  // Controleer of het ID een getal is

    const review = await getReviewById(id);  // Haal de specifieke review op via de service
    if (!review) {
      return res.status(404).json({ message: 'Review niet gevonden' });  // Als er geen review wordt gevonden
    }
    res.json(review);  // Retourneer de specifieke review als JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij ophalen van review' });  // Foutmelding bij het ophalen van een review
  }
});

// ✅ Maak een nieuwe review aan
router.post('/', async (req, res) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;

    // Controleer of alle vereiste velden aanwezig zijn
    if (!userId || !propertyId || !rating || !comment) {
      return res.status(400).json({ message: 'Alle velden zijn verplicht' });
    }

    // Maak de review aan via de service
    const newReview = await createReview(req.body);
    res.status(201).json(newReview);  // Retourneer de nieuwe review als JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij aanmaken van review' });  // Foutmelding bij het aanmaken van een review
  }
});

export default router;  // Exporteer de router
