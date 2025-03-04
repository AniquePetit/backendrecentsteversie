import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Functie om te controleren of een datum geldig is
const isValidDate = (date) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

// ✅ Haal alle boekingen op
export const getAllBookings = async () => {
  try {
    console.log('Haal alle boekingen op');
    return await prisma.booking.findMany({
      include: { property: true }, // Optioneel: Haal ook property details op
    });
  } catch (error) {
    console.error('Error getting all bookings:', error);
    throw new Error('Fout bij ophalen van boekingen');
  }
};

// ✅ Maak een nieuwe boeking aan
export const createBooking = async (data) => {
  try {
    console.log('Ontvangen data voor nieuwe boeking:', data);

    // Controleer of de datums geldig zijn
    if (!isValidDate(data.checkinDate) || !isValidDate(data.checkoutDate)) {
      throw new Error('Ongeldige datums');
    }

    // Parse de datums naar JavaScript Date objecten
    const checkinDate = new Date(data.checkinDate);
    const checkoutDate = new Date(data.checkoutDate);

    // Controleer of de verplichte velden aanwezig zijn
    if (!data.userId || !data.propertyId || !data.numberOfGuests || !data.totalPrice) {
      throw new Error('Alle vereiste velden moeten ingevuld zijn');
    }

    // Voeg de `bookingStatus` toe in de `create` aanroep
    const newBooking = await prisma.booking.create({
      data: {
        userId: data.userId,
        propertyId: data.propertyId,
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        numberOfGuests: data.numberOfGuests,
        totalPrice: Math.round(data.totalPrice), // Zorg ervoor dat totalPrice een geheel getal is
        bookingStatus: data.bookingStatus || "pending", // Zet "pending" als default waarde als deze ontbreekt
      },
    });

    console.log('Nieuwe boeking aangemaakt:', newBooking);
    return newBooking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Fout bij aanmaken van boeking');
  }
};

// ✅ Werk een bestaande boeking bij (PUT)
export const updateBooking = async (id, data) => {
  try {
    console.log('Ontvangen data voor update:', data);

    // Zoek de boeking op basis van de ID
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      throw new Error(`Boeking met ID ${id} niet gevonden`);
    }

    // Controleer of de datums geldig zijn, indien aanwezig
    const checkinDate = data.checkinDate ? new Date(data.checkinDate) : existingBooking.checkinDate;
    const checkoutDate = data.checkoutDate ? new Date(data.checkoutDate) : existingBooking.checkoutDate;

    // Zorg ervoor dat de datums geldig zijn
    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) {
      throw new Error('Ongeldige datums');
    }

    // Werk de boeking bij
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        checkinDate: checkinDate,
        checkoutDate: checkoutDate,
        numberOfGuests: data.numberOfGuests ?? existingBooking.numberOfGuests,
        totalPrice: Math.round(data.totalPrice) ?? existingBooking.totalPrice,
        bookingStatus: data.bookingStatus ?? existingBooking.bookingStatus,
      },
    });

    console.log('Boeking bijgewerkt:', updatedBooking);
    return updatedBooking;
  } catch (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    throw new Error('Fout bij bijwerken van boeking');
  }
};

// ✅ Verwijder een boeking (DELETE)
export const deleteBooking = async (id) => {
  try {
    console.log('Probeer boeking te verwijderen met ID:', id);

    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      throw new Error(`Boeking met ID ${id} niet gevonden`);
    }

    // Verwijder de boeking
    await prisma.booking.delete({
      where: { id },
    });

    console.log('Boeking succesvol verwijderd:', id);
    return { message: 'Boeking succesvol verwijderd' };
  } catch (error) {
    console.error(`Error deleting booking with ID ${id}:`, error);
    throw new Error('Fout bij verwijderen van boeking');
  }
};
