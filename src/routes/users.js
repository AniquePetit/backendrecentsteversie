import express from 'express';
import { getAllUsers, createUser } from '../services/userService.js';

const router = express.Router();

// GET route voor alle gebruikers
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST route om een nieuwe gebruiker aan te maken
router.post('/', async (req, res) => {
  try {
    // Zorg ervoor dat pictureUrl altijd aanwezig is (standaardafbeelding als het ontbreekt)
    const userData = req.body;

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

export default router;
