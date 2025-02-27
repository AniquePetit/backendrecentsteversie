import express from 'express';
import { login } from '../services/authService.js';  // Zorg ervoor dat dit pad klopt

const router = express.Router();

// Login route
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email en wachtwoord zijn verplicht' });
  }

  // Roep de login functie aan
  const result = await login(email, password);

  // Als er een token is, stuur het terug
  if (result.token) {
    return res.json({ token: result.token });
  } else {
    return res.status(401).json({ error: result.error });
  }
});

export default router;
