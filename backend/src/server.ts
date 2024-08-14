import fastify from "fastify";
import cors from "@fastify/cors";
import { Entry } from "@prisma/client";
import Prisma from "./db";

export const server = fastify();

server.register(cors, {});

server.get<{ Reply: Entry[] }>("/get/", async (req, reply) => {
  const dbAllEntries = await Prisma.entry.findMany({});
  reply.send(dbAllEntries);
});

server.get<{ Body: Entry; Params: { id: string } }>(
  "/get/:id",
  async (req, reply) => {
    const dbEntry = await Prisma.entry.findUnique({
      where: { id: req.params.id },
    });
    if (!dbEntry) {
      reply.status(500).send({ msg: `Error finding entry with id ${req.params.id}` });
    }
    reply.send(dbEntry);
  }
);

server.post<{ Body: Entry }>("/create/", async (req, reply) => {
  let newEntryBody = req.body;
  newEntryBody.created_at = newEntryBody.created_at ? new Date(newEntryBody.created_at) : new Date();
  newEntryBody.scheduledDate = newEntryBody.scheduledDate ? new Date(newEntryBody.scheduledDate) : null;
  try {
    const createdEntryData = await Prisma.entry.create({ data: newEntryBody });
    reply.send(createdEntryData);
  } catch (error) {
    reply.status(500).send({ msg: "Error creating entry", error });
  }
});

server.delete<{ Params: { id: string } }>("/delete/:id", async (req, reply) => {
  try {
    await Prisma.entry.delete({ where: { id: req.params.id } });
    reply.send({ msg: "Deleted successfully" });
  } catch {
    reply.status(500).send({ msg: "Error deleting entry" });
  }
});

server.put<{ Params: { id: string }; Body: Entry }>(
  "/update/:id",
  async (req, reply) => {
    let updatedEntryBody = req.body;
    updatedEntryBody.created_at = updatedEntryBody.created_at ? new Date(updatedEntryBody.created_at) : new Date();
    updatedEntryBody.scheduledDate = updatedEntryBody.scheduledDate ? new Date(updatedEntryBody.scheduledDate) : null;
    try {
      const updatedEntry = await Prisma.entry.update({
        data: updatedEntryBody,
        where: { id: req.params.id },
      });
      reply.send(updatedEntry);
    } catch (error) {
      reply.status(500).send({ msg: "Error updating", error });
    }
  }
);