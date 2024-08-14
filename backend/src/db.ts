import { PrismaClient } from "@prisma/client";

export interface Entry {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    scheduledDate: Date | null; 
}
const Prisma = new PrismaClient();

export default Prisma;
