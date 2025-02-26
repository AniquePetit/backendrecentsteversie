import { PrismaClient } from '@prisma/client'; 
const prisma = new PrismaClient();

// Functie om alle hosts op te halen
const getAllHosts = async () => {
  return await prisma.host.findMany();
};

// Functie om één host op te halen via ID
const getHostById = async (id) => {
  return await prisma.host.findUnique({
    where: { id: id },  // Zorg ervoor dat het ID goed is
  });
};

// Functie om een nieuwe host aan te maken
const createHost = async (hostData) => {
  try {
    console.log("hostData:", hostData);  // Log de ontvangen data voor debuggen
    console.log("hostData username:", hostData.username);
    console.log("hostData email:", hostData.email);

    const newHost = await prisma.host.create({
      data: {
        username: hostData.username,
        email: hostData.email,
        password: hostData.password,  // Zorg ervoor dat je wachtwoord goed verwerkt wordt (hashed)
        phoneNumber: hostData.phoneNumber,
        profilePicture: hostData.profilePicture,
        aboutMe: hostData.aboutMe,
      },
    });

    // Geef de nieuwe host terug
    return newHost;
  } catch (error) {
    console.log("error:", error);  // Log de fout voor debuggen
    throw new Error('Fout bij het aanmaken van host');  // Foutmelding bij mislukking
  }
};

// Functie om een host bij te werken
const updateHost = async (id, hostData) => {
  const host = await prisma.host.findUnique({ where: { id: id } });
  if (host) {
    return await prisma.host.update({
      where: { id: id },
      data: hostData,
    });
  }
  return null;  // Als de host niet gevonden wordt, return null
};

// Functie om een host te verwijderen
const deleteHost = async (id) => {
  const host = await prisma.host.findUnique({ where: { id: id } });
  if (host) {
    return await prisma.host.delete({
      where: { id: id },
    });
  }
  return null;  // Als de host niet gevonden wordt, return null
};

export default { getAllHosts, getHostById, createHost, updateHost, deleteHost };
