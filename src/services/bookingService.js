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

// ✅ Haal een specifieke boeking op via ID
export const getBookingById = async (id) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });
    return booking;
  } catch (error) {
    console.error(`Error getting booking with ID ${id}:`, error);
    throw new Error('Fout bij ophalen van boeking');
  }
};

// ✅ Maak een nieuwe boeking aan
export const createBooking = async (data) => {
  try {
    if (!data.propertyId || !data.userId || !data.startDate || !data.endDate) {
      throw new Error('Alle vereiste velden moeten ingevuld zijn');
    }

    const newBooking = await prisma.booking.create({
      data: {
        propertyId: data.propertyId,
        userId: data.userId,
        startDate: data.startDate,
        endDate: data.endDate,
        status: 'Pending',
      },
    });
    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Fout bij aanmaken van boeking');
  }
};

// ✅ Update een boeking
export const updateBooking = async (id, data) => {
  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data,
    });
    return updatedBooking;
  } catch (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    throw new Error('Fout bij updaten van boeking');
  }
};

// ✅ Verwijder een boeking
export const deleteBooking = async (id) => {
  try {
    const deletedBooking = await prisma.booking.delete({
      where: { id: parseInt(id) },
    });
    return deletedBooking;
  } catch (error) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    throw new Error('Fout bij verwijderen van boeking');
  }
};
