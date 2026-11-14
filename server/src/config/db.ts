
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDB() {
  await prisma.$connect();
  console.log("PostgreSQL connected successfully!");
}

export default prisma;
