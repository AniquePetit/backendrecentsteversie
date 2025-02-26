import prisma from '../prisma/prismaClient.js';

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

export { getAllUsers };
