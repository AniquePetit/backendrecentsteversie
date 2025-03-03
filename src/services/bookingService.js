import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ Haal alle boekingen op
export const getAllBookings = async () => {
  try {
    const bookings = await prisma.booking.findMany();
    return bookings;
  } catch (error) {
    console.error('Error getting all bookings:', error);
    throw new Error('Fout bij ophalen van boekingen');
  }
};

// ✅ Maak een nieuwe boeking aan
export const createBooking = async (data) => {
  try {
    // Parse de datums
    const checkInDate = new Date(data.checkInDate);
    const checkOutDate = new Date(data.checkOutDate);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      throw new Error('Ongeldige datums');
    }

    // Controleer of de velden aanwezig zijn
    if (!data.userId || !data.propertyId || !data.numberOfGuests || !data.totalPrice) {
      throw new Error('Alle vereiste velden moeten ingevuld zijn');
    }

    const newBooking = await prisma.booking.create({
      data: {
        userId: data.userId,
        propertyId: data.propertyId,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        numberOfGuests: data.numberOfGuests,
        totalPrice: data.totalPrice,
      },
    });

    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Fout bij aanmaken van boeking');
  }
};
