import express from 'express';
import { getAllAmenities } from '../services/amenityService.js';
// import authMiddleware from '../middleware/authMiddleware.js';  // Middleware is uitcommentarieerd

const router = express.Router();

// ✅ Haal alle voorzieningen op
router.get('/', async (req, res) => {
  try {
    const amenities = await getAllAmenities();
    res.json(amenities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij ophalen van voorzieningen' });
  }
});

// ✅ Haal een specifieke voorziening op
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Ongeldige ID' });

    const amenity = await amenityService.getAmenityById(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }
    res.json(amenity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij ophalen van voorziening' });
  }
});

// ✅ Maak een nieuwe voorziening aan (beveiligd)
router.post('/', /* authMiddleware, */ async (req, res) => {  // authMiddleware is uitcommentarieerd
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Naam is verplicht' });

    const newAmenity = await amenityService.createAmenity(req.body);
    res.status(201).json(newAmenity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij aanmaken van voorziening' });
  }
});

// ✅ Update een bestaande voorziening (beveiligd)
router.put('/:id', /* authMiddleware, */ async (req, res) => {  // authMiddleware is uitcommentarieerd
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Ongeldige ID' });

    const updatedAmenity = await amenityService.updateAmenity(id, req.body);
    if (!updatedAmenity) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }
    res.json(updatedAmenity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij updaten van voorziening' });
  }
});

// ✅ Verwijder een voorziening (beveiligd)
router.delete('/:id', /* authMiddleware, */ async (req, res) => {  // authMiddleware is uitcommentarieerd
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: 'Ongeldige ID' });

    const deleted = await amenityService.deleteAmenity(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }
    res.json({ message: 'Voorziening verwijderd' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij verwijderen van voorziening' });
  }
});

export default router;  // Default export
