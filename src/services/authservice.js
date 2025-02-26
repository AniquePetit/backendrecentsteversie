import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/prismaClient.js'; // Zorg ervoor dat het pad klopt

export async function login(email, password) {
  try {
    // Zoek gebruiker op basis van email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return { error: 'Gebruiker niet gevonden' }; // Gebruiker niet gevonden
    }

    // Vergelijk het wachtwoord met de opgeslagen gehashte versie
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: 'Onjuist wachtwoord' }; // Ongeldig wachtwoord
    }

    // Zorg ervoor dat JWT_SECRET in .env is ingesteld
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET ontbreekt in de omgevingsvariabelen');
    }

    // Genereer het JWT-token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }  // Het token vervalt na 1 uur
    );

    return { token }; // Geef het token terug
  } catch (error) {
    console.error('Inlogfout:', error.message);
    return { error: 'Er is een fout opgetreden tijdens het inloggen' };
  }
}
