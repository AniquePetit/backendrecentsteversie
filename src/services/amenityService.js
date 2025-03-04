import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Haal alle voorzieningen op
export const getAllAmenities = async () => {
  return await prisma.amenity.findMany();
};

// ✅ Haal één voorziening op via ID
export const getAmenityById = async (id) => {
  return await prisma.amenity.findUnique({
    where: { id },
  });
};

// ✅ Maak een nieuwe voorziening aan
export const createAmenity = async (data) => {
  if (!data.name) throw new Error('Naam is verplicht');

  return await prisma.amenity.create({
    data: {
      name: data.name,
    },
  });
};

// ✅ Update een voorziening
export const updateAmenity = async (id, data) => {
  return await prisma.amenity.update({
    where: { id },
    data,
  });
};

// ✅ Verwijder een voorziening
export const deleteAmenity = async (id) => {
  try {
    return await prisma.amenity.delete({
      where: { id },
    });
  } catch (error) {
    return null; // Als de voorziening niet bestaat, geef null terug
  }
};
