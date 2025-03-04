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
    if (!hostData.username || !hostData.email || !hostData.password || !hostData.name) {
      throw new Error('Username, email, wachtwoord en name zijn verplicht');
    }

    const existingHost = await prisma.host.findFirst({
      where: { email: hostData.email },
    });

    if (existingHost) {
      throw new Error('Het e-mailadres is al in gebruik');
    }

    const hashedPassword = await bcrypt.hash(hostData.password, 10);

    const newHost = await prisma.host.create({
      data: {
        username: hostData.username,
        email: hostData.email,
        password: hashedPassword,
        phoneNumber: hostData.phoneNumber,
        profilePicture: hostData.profilePicture,
        aboutMe: hostData.aboutMe,
        name: hostData.name,
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
    const host = await prisma.host.findUnique({ where: { id: id } });

    if (!host) {
      throw new Error('Host niet gevonden');
    }

    const updatedHost = await prisma.host.update({
      where: { id: id },
      data: {
        username: hostData.username || host.username,
        email: hostData.email || host.email,
        password: hostData.password || host.password,
        phoneNumber: hostData.phoneNumber || host.phoneNumber,
        profilePicture: hostData.profilePicture || host.profilePicture,
        aboutMe: hostData.aboutMe || host.aboutMe,
        name: hostData.name || host.name,
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
    const host = await prisma.host.findUnique({ where: { id: id } });

    if (!host) {
      throw new Error('Host niet gevonden');
    }

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
  deleteHost,
};
