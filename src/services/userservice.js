import prisma from '../prisma/prismaClient.js'; // Zorg ervoor dat dit klopt met jouw import
import bcrypt from 'bcrypt'; // Gebruik bcrypt om wachtwoorden te hashen

// Haal alle gebruikers op
const getAllUsers = async () => {
  try {
    return await prisma.user.findMany(); // Haal alle gebruikers op
  } catch (error) {
    console.error('Fout bij het ophalen van gebruikers:', error);
    throw new Error('Fout bij het ophalen van gebruikers');
  }
};

// Functie om een nieuwe gebruiker aan te maken
const createUser = async (userData) => {
  try {
    // Valideer de gegevens
    if (!userData.email || !userData.password || !userData.username || !userData.pictureUrl) {
      throw new Error('Email, password, username en pictureUrl zijn verplicht');
    }

    // Controleer of de gebruiker al bestaat door naar het unieke 'username' te zoeken
    const existingUserByUsername = await prisma.user.findUnique({
      where: {
        username: userData.username,  // Zoek op basis van de unieke username
      },
    });

    if (existingUserByUsername) {
      throw new Error('Gebruiker met dit gebruikersnaam bestaat al');
    }

    // Controleer of het e-mailadres al bestaat
    const existingUserByEmail = await prisma.user.findMany({
      where: {
        email: userData.email,  // Zoek op basis van email, maar dit is niet uniek
      },
    });

    if (existingUserByEmail.length > 0) {
      throw new Error('Dit e-mailadres is al geregistreerd');
    }

    // Wachtwoord hashen
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Maak de nieuwe gebruiker aan
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword, // Sla het gehashte wachtwoord op
        name: userData.name,
        phoneNumber: userData.phoneNumber,
        pictureUrl: userData.pictureUrl, // Zorg ervoor dat pictureUrl altijd wordt doorgegeven
      },
    });

    return newUser;  // Retourneer de nieuwe gebruiker
  } catch (error) {
    console.error('Fout bij het aanmaken van gebruiker:', error);
    throw new Error(`Fout bij het aanmaken van gebruiker: ${error.message}`);
  }
};

export { getAllUsers, createUser };  // Exporteer zowel de getAllUsers als de createUser functie
