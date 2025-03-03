import express from 'express';
import { 
  getAllAmenities, 
  getAmenityById, 
  createAmenity, 
  updateAmenity, 
  deleteAmenity 
} from '../services/amenityService.js';

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
    const { id } = req.params;

    const amenity = await getAmenityById(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }
    res.json(amenity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij ophalen van voorziening' });
  }
});

// ✅ Maak een nieuwe voorziening aan
router.post('/', async (req, res) => {  
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Naam is verplicht' });

    const newAmenity = await createAmenity({ name }); // 🛠️ Fix: Stuur alleen `name`
    res.status(201).json(newAmenity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij aanmaken van voorziening' });
  }
});

// ✅ Update een bestaande voorziening
router.put('/:id', async (req, res) => {  
  try {
    const { id } = req.params;
    const updatedAmenity = await updateAmenity(id, req.body);
    if (!updatedAmenity) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }
    res.json(updatedAmenity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij updaten van voorziening' });
  }
});

// ✅ Verwijder een voorziening
router.delete('/:id', async (req, res) => {  
  try {
    const { id } = req.params;
    const deleted = await deleteAmenity(id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }
    
    res.json({ message: 'Voorziening verwijderd' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij verwijderen van voorziening' });
  }
});

export default router;
