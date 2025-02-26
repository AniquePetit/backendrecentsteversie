// src/services/propertyService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Functie om alle accommodaties op te halen
const getAllProperties = async () => {
  return await prisma.property.findMany();
};

// Functie om accommodatie op te halen via ID
const getPropertyById = async (id) => {
  return await prisma.property.findUnique({ where: { id: Number(id) } });
};

// Functie om een nieuwe accommodatie aan te maken
const createProperty = async (userId, propertyData) => {
  return await prisma.property.create({
    data: {
      ...propertyData,
      userId, // Koppelt de accommodatie aan de gebruiker
    },
  });
};

// Functie om een accommodatie bij te werken
const updateProperty = async (id, userId, propertyData) => {
  const property = await prisma.property.findUnique({ where: { id: Number(id) } });
  if (property && property.userId === userId) {
    return await prisma.property.update({
      where: { id: Number(id) },
      data: propertyData,
    });
  }
  return null; // Als de gebruiker geen rechten heeft om de accommodatie bij te werken
};

// Functie om een accommodatie te verwijderen
const deleteProperty = async (id, userId) => {
  const property = await prisma.property.findUnique({ where: { id: Number(id) } });
  if (property && property.userId === userId) {
    return await prisma.property.delete({ where: { id: Number(id) } });
  }
  return null; // Als de gebruiker geen rechten heeft om de accommodatie te verwijderen
};

export default {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
