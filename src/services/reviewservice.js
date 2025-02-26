import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Haal alle reviews op
export const getAllReviews = async () => {
  try {
    const reviews = await prisma.review.findMany();  // Haal alle reviews op uit de database
    return reviews;
  } catch (error) {
    console.error('Error getting all reviews:', error);
    throw new Error('Fout bij ophalen van reviews');
  }
};

// ✅ Haal review op met specifiek ID
export const getReviewById = async (id) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id: parseInt(id) },  // Zorgt ervoor dat het ID als integer wordt geparsed
    });
    return review;
  } catch (error) {
    console.error(`Error getting review with ID ${id}:`, error);
    throw new Error('Fout bij ophalen van review');
  }
};

// ✅ Maak een nieuwe review aan
export const createReview = async (data) => {
  try {
    // Validatie van de vereiste velden
    if (!data.userId || !data.propertyId || !data.rating || !data.comment) {
      throw new Error('Alle vereiste velden moeten ingevuld zijn');
    }

    // Controleer of de gebruiker bestaat in de User tabel
    const userExists = await prisma.user.findUnique({
      where: { id: data.userId },  // Controleer of de gebruiker bestaat
    });
    
    if (!userExists) {
      throw new Error('De opgegeven gebruiker bestaat niet');
    }

    // Controleer of de woning bestaat in de Property tabel
    const propertyExists = await prisma.property.findUnique({
      where: { id: data.propertyId },  // Controleer of de woning bestaat
    });

    if (!propertyExists) {
      throw new Error('De opgegeven woning bestaat niet');
    }

    // Als de gebruiker en woning bestaan, voeg dan de review toe
    const newReview = await prisma.review.create({
      data: {
        userId: data.userId,  // ID van de gebruiker die de review schrijft
        propertyId: String(data.propertyId),  // Zet propertyId om naar een string (UUID)
        rating: data.rating,  // Waardering (bijvoorbeeld 1 tot 5)
        comment: data.comment,  // Commentaar in de review
      },
    });
    return newReview;
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Fout bij aanmaken van review');
  }
};
