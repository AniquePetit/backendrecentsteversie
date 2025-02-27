import { PrismaClient } from '@prisma/client'; 
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Functie om alle hosts op te halen
const getAllHosts = async () => {
  try {
    return await prisma.host.findMany();
  } catch (error) {
    console.log("Fout bij ophalen van hosts:", error);
    throw new Error('Fout bij het ophalen van hosts');
  }
};

// Functie om één host op te halen via ID
const getHostById = async (id) => {
  try {
    const host = await prisma.host.findUnique({
      where: { id: id }
    });

    if (!host) {
      throw new Error('Host niet gevonden');
    }

    return host;
  } catch (error) {
    console.log("Fout bij ophalen van host:", error);
    throw new Error('Fout bij het ophalen van host');
  }
};

// Functie om een nieuwe host aan te maken
const createHost = async (hostData) => {
  try {
    // Validatie van de benodigde velden
    if (!hostData.username || !hostData.email || !hostData.password || !hostData.name) {
      throw new Error('Username, email, wachtwoord en name zijn verplicht');
    }

    // Controleer of het e-mailadres al in gebruik is
    const existingHost = await prisma.host.findFirst({
      where: {
        email: hostData.email,  // Zoek naar hosts met hetzelfde e-mailadres
      },
    });

    if (existingHost) {
      throw new Error('Het e-mailadres is al in gebruik');
    }

    // Wachtwoord hashen
    const hashedPassword = await bcrypt.hash(hostData.password, 10);  // 10 is het aantal "salt rounds"

    // Maak de nieuwe host aan in de database
    const newHost = await prisma.host.create({
      data: {
        username: hostData.username,
        email: hostData.email,
        password: hashedPassword,  // Gebruik de gehashte versie van het wachtwoord
        phoneNumber: hostData.phoneNumber,
        profilePicture: hostData.profilePicture,
        aboutMe: hostData.aboutMe,
        name: hostData.name  // Vergeet het 'name' veld niet toe te voegen
      },
    });

    return newHost;
  } catch (error) {
    console.log("Fout bij het aanmaken van host:", error);
    throw new Error('Fout bij het aanmaken van host');
  }
};

// Functie om een host bij te werken
const updateHost = async (id, hostData) => {
  try {
    // Zoek de host
    const host = await prisma.host.findUnique({ where: { id: id } });

    if (!host) {
      throw new Error('Host niet gevonden');
    }

    // Update de host
    const updatedHost = await prisma.host.update({
      where: { id: id },
      data: {
        username: hostData.username || host.username,  // Werk bij, als er een nieuwe username is
        email: hostData.email || host.email,            // Werk bij, als er een nieuw email is
        password: hostData.password || host.password,  // Werk bij, als er een nieuw wachtwoord is
        phoneNumber: hostData.phoneNumber || host.phoneNumber,
        profilePicture: hostData.profilePicture || host.profilePicture,
        aboutMe: hostData.aboutMe || host.aboutMe,
        name: hostData.name || host.name  // Werk bij, als er een nieuwe naam is
      },
    });

    return updatedHost;
  } catch (error) {
    console.log("Fout bij het bijwerken van host:", error);
    throw new Error('Fout bij het bijwerken van host');
  }
};

// Functie om een host te verwijderen
const deleteHost = async (id) => {
  try {
    // Zoek de host
    const host = await prisma.host.findUnique({ where: { id: id } });

    if (!host) {
      throw new Error('Host niet gevonden');
    }

    // Verwijder de host
    await prisma.host.delete({
      where: { id: id },
    });

    return { message: 'Host succesvol verwijderd' };
  } catch (error) {
    console.log("Fout bij het verwijderen van host:", error);
    throw new Error('Fout bij het verwijderen van host');
  }
};

export default {
  getAllHosts,
  getHostById,
  createHost,
  updateHost,
  deleteHost
};
