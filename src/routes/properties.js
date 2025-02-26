import express from 'express';
const router = express.Router();
import propertyService from '../services/propertyService.js';

import authMiddleware from '../middleware/authMiddleware.js'; // Zorg ervoor dat het pad klopt


// ✅ Haal alle accommodaties op
router.get('/', async (req, res) => {
  try {
    const properties = await propertyService.getAllProperties();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen van accommodaties' });
  }
});

// ✅ Haal één accommodatie op via ID
router.get('/:id', async (req, res) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Accommodatie niet gevonden' });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij ophalen van accommodatie' });
  }
});

// ✅ Maak een nieuwe accommodatie aan (alleen ingelogde hosts)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newProperty = await propertyService.createProperty(req.user.userId, req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij aanmaken van accommodatie' });
  }
});

// ✅ Update een accommodatie (alleen eigenaar)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProperty = await propertyService.updateProperty(req.params.id, req.user.userId, req.body);
    if (!updatedProperty) {
      return res.status(404).json({ message: 'Accommodatie niet gevonden of geen rechten' });
    }
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Fout bij updaten van accommodatie' });
  }
});

// ✅ Verwijder een accommodatie (alleen eigenaar)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await propertyService.deleteProperty(req.params.id, req.user.userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Accommodatie niet gevonden of geen rechten' });
    }
    res.json({ message: 'Accommodatie verwijderd' });
  } catch (error) {
    res.status(500).json({ message: 'Fout bij verwijderen van accommodatie' });
  }
});

export default router;  // Exporteer de router als default
