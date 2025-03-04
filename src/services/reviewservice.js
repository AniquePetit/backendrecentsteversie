import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Haal alle reviews op
export const getAllReviews = async () => {
  try {
    return await prisma.review.findMany();
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw new Error('Fout bij ophalen van reviews');
  }
};

// ✅ Haal review op met specifiek ID (LET OP: UUID is een string!)
export const getReviewById = async (id) => {
  try {
    return await prisma.review.findUnique({
      where: { id: id }, // ❌ GEEN parseInt(), UUID blijft string
    });
  } catch (error) {
    console.error(`Error getting review with ID ${id}:`, error);
    throw new Error('Fout bij ophalen van review');
  }
};

// ✅ Maak een nieuwe review aan
export const createReview = async (data) => {
  try {
    if (!data.userId || !data.propertyId || !data.rating || !data.comment) {
      throw new Error('Alle vereiste velden moeten ingevuld zijn');
    }

    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new Error('De opgegeven gebruiker bestaat niet');
    }

    const propertyExists = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!propertyExists) {
      throw new Error('De opgegeven woning bestaat niet');
    }

    return await prisma.review.create({
      data: {
        userId: data.userId,
        propertyId: data.propertyId, // Geen String() nodig, blijft gewoon een string
        rating: data.rating,
        comment: data.comment,
      },
    });
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Fout bij aanmaken van review');
  }
};

// ✅ **Werk een bestaande review bij (PUT)**
export const updateReview = async (id, reviewData) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: id }, // ❌ GEEN parseInt(), UUID blijft string
    });

    if (!review) {
      return null;
    }

    return await prisma.review.update({
      where: { id: id }, // ❌ GEEN parseInt(), UUID blijft string
      data: {
        rating: reviewData.rating ?? review.rating,
        comment: reviewData.comment ?? review.comment,
      },
    });
  } catch (error) {
    console.error(`Error updating review with ID ${id}:`, error);
    throw new Error('Fout bij bijwerken van review');
  }
};

// ✅ **Verwijder een review**
export const deleteReview = async (id) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: id }, // Zoek de review op basis van het ID
    });

    if (!review) {
      return null; // Als de review niet gevonden wordt, return null
    }

    // Verwijder de review uit de database
    return await prisma.review.delete({
      where: { id: id },
    });
  } catch (error) {
    console.error(`Error deleting review with ID ${id}:`, error);
    throw new Error('Fout bij verwijderen van review');
  }
};
