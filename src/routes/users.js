import express from 'express';
import { getAllUsers, createUser, getUserById, updateUser, deleteUser } from '../services/userService.js';

const router = express.Router();

// ✅ Haal alle gebruikers op (GET route)
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Maak een nieuwe gebruiker aan (POST route)
router.post('/', async (req, res) => {
  try {
    const userData = req.body;

    // Zorg ervoor dat pictureUrl altijd aanwezig is (standaardafbeelding als het ontbreekt)
    if (!userData.pictureUrl) {
      userData.pictureUrl = 'https://example.com/default-profile-pic.jpg'; // Standaard afbeelding
    }

    const newUser = await createUser(userData);
    res.status(201).json(newUser); // Nieuwe gebruiker succesvol aangemaakt
  } catch (error) {
    console.error('Fout bij het aanmaken van gebruiker:', error);
    res.status(400).json({ error: error.message }); // Fout bij het aanmaken van gebruiker
  }
});

// ✅ Haal een specifieke gebruiker op (GET route)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Fout bij ophalen van gebruiker' });
  }
});

// ✅ Werk een bestaande gebruiker bij (PUT route)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Haal het ID uit de URL
    const { name, email, phoneNumber, pictureUrl } = req.body;  // Gegevens uit de request body

    // Valideer of de noodzakelijke velden aanwezig zijn
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({ message: 'Naam, email en telefoonnummer zijn verplicht' });
    }

    // Update de gebruiker met de nieuwe gegevens
    const updatedUser = await updateUser(id, { name, email, phoneNumber, pictureUrl });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Fout bij bijwerken van gebruiker' });
  }
});

// ✅ Verwijder een gebruiker (DELETE route)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Haal het ID uit de URL

    const deleted = await deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Gebruiker niet gevonden' });
    }

    res.json({ message: 'Gebruiker verwijderd' });
  } catch (error) {
    res.status(500).json({ error: 'Fout bij verwijderen van gebruiker' });
  }
});

export default router;
