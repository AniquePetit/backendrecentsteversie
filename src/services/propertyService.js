import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Functie om alle accommodaties op te halen
const getAllProperties = async () => {
  try {
    return await prisma.property.findMany({
      include: {
        host: true,
        amenities: true,
        bookings: true,
        reviews: true,
      },
    });
  } catch (error) {
    console.error('Fout bij ophalen van accommodaties:', error);
    throw new Error('Fout bij ophalen van accommodaties');
  }
};

// Functie om accommodatie op te halen via ID
const getPropertyById = async (id) => {
  try {
    return await prisma.property.findUnique({
      where: { id },
      include: {
        host: true,
        amenities: true,
        bookings: true,
        reviews: true,
      },
    });
  } catch (error) {
    console.error('Fout bij ophalen van accommodatie via ID:', error);
    throw new Error('Fout bij ophalen van accommodatie via ID');
  }
};

// Functie om een nieuwe accommodatie aan te maken
const createProperty = async (hostId, propertyData) => {
  // Checken of de host met de gegeven userId bestaat
  const host = await prisma.host.findUnique({
    where: { id: hostId },
  });

  if (!host) {
    throw new Error('Host met de opgegeven userId bestaat niet');
  }

  try {
    // Nieuwe accommodatie aanmaken en verbinden met de host
    const newProperty = await prisma.property.create({
      data: {
        title: propertyData.title,
        description: propertyData.description,
        location: propertyData.location,
        pricePerNight: propertyData.pricePerNight,
        bedroomCount: propertyData.bedroomCount,
        bathRoomCount: propertyData.bathRoomCount,
        maxGuestCount: propertyData.maxGuestCount,
        rating: propertyData.rating || 0, // Als rating niet meegegeven, gebruik 0 als default
        host: {
          connect: { id: hostId }, // Koppel het property aan de host via hostId
        },
      },
    });
    return newProperty;
  } catch (error) {
    console.error('Fout bij aanmaken van accommodatie:', error);
    throw new Error('Fout bij aanmaken van accommodatie');
  }
};

// Functie om een accommodatie bij te werken
const updateProperty = async (id, hostId, propertyData) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (property && property.hostId === hostId) {
    try {
      // Accommodatie bijwerken
      const updatedProperty = await prisma.property.update({
        where: { id },
        data: {
          title: propertyData.title,
          description: propertyData.description,
          location: propertyData.location,
          pricePerNight: propertyData.pricePerNight,
          bedroomCount: propertyData.bedroomCount,
          bathRoomCount: propertyData.bathRoomCount,
          maxGuestCount: propertyData.maxGuestCount,
          rating: propertyData.rating || 0, // Als rating niet is meegegeven, gebruik 0 als default
        },
      });
      return updatedProperty;
    } catch (error) {
      console.error('Fout bij updaten van accommodatie:', error);
      throw new Error(`Fout bij updaten van accommodatie: ${error.message}`);
    }
  } else {
    throw new Error('Accommodatie niet gevonden of geen rechten');
  }
};

// Functie om een accommodatie te verwijderen
const deleteProperty = async (id, hostId) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (property && property.hostId === hostId) {
    try {
      // Accommodatie verwijderen
      const deletedProperty = await prisma.property.delete({
        where: { id },
      });
      return deletedProperty;
    } catch (error) {
      console.error('Fout bij verwijderen van accommodatie:', error);
      throw new Error(`Fout bij verwijderen van accommodatie: ${error.message}`);
    }
  } else {
    throw new Error('Accommodatie niet gevonden of geen rechten');
  }
};

export default {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
