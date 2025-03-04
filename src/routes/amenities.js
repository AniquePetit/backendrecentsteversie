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
    const { name } = req.body;

    // Validatie van naam
    if (!name) {
      return res.status(400).json({ message: 'Naam is verplicht' });
    }

    // Zorg ervoor dat de voorziening bestaat
    const existingAmenity = await getAmenityById(id);
    if (!existingAmenity) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }

    // Werk de voorziening bij
    const updatedAmenity = await updateAmenity(id, { name });

    // Geef de bijgewerkte voorziening terug
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

    // Controleer of de voorziening bestaat
    const existingAmenity = await getAmenityById(id);
    if (!existingAmenity) {
      return res.status(404).json({ message: 'Voorziening niet gevonden' });
    }

    // Verwijder de voorziening
    const deletedAmenity = await deleteAmenity(id);

    // Geef een succesbericht terug
    res.json({ message: 'Voorziening verwijderd', amenity: deletedAmenity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fout bij verwijderen van voorziening' });
  }
});

export default router;
