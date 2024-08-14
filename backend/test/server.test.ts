import { FastifyInstance } from 'fastify';
import { server } from '../src/server';  // Import the Fastify server from the source file
import { PrismaClient } from '@prisma/client';

// Declare variables for the Fastify app and Prisma client
let app: FastifyInstance;
let prisma: PrismaClient;

// This runs before all tests to set up the environment
beforeAll(async () => {
  app = server; // Assign the Fastify server to the app variable
  prisma = new PrismaClient(); // Initialise the Prisma client
  await prisma.$connect(); // Connect to the database using Prisma
});

// This runs after all tests to clean up the environment
afterAll(async () => {
  await app.close(); // Close the Fastify server
  await prisma.$disconnect(); // Disconnect from the database
});

// Group of tests for the server routes
describe('Server Routes', () => {

  let createdEntryId: string; // Variable to store an entry's ID for use in tests

  // This runs before each test to ensure a clean database state
  beforeEach(async () => {
    await prisma.entry.deleteMany({}); // Delete all entries in the database
  });

  // This runs after each test to clean up the database
  afterEach(async () => {
    await prisma.entry.deleteMany({}); // Delete all entries in the database
  });

  // Test for retrieving all entries
  test('GET /get/ should return all entries', async () => {
    // Create a test entry in the database
    await prisma.entry.create({
      data: {
        title: 'Test Entry',
        description: 'This is a test entry',
        created_at: new Date(),
        scheduledDate: new Date()
      }
    });

    // Send a GET request to the /get/ endpoint
    const response = await app.inject({
      method: 'GET',
      url: '/get/'
    });

    // Check that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);
    const entries = response.json(); // Parse the response body as JSON
    expect(entries).toBeInstanceOf(Array); // Verify that the response is an array
    expect(entries.length).toBeGreaterThan(0); // Verify that the array has at least one entry
    expect(entries[0]).toHaveProperty('title', 'Test Entry'); // Verify the first entry's title
  });

  // Test for creating a new entry
  test('POST /create/ should create a new entry', async () => {
    const newEntry = {
      title: 'New Test Entry',
      description: 'This is a new test entry',
      created_at: new Date(),
      scheduledDate: new Date()
    };

    // Send a POST request to the /create/ endpoint with the new entry as payload
    const response = await app.inject({
      method: 'POST',
      url: '/create/',
      payload: newEntry
    });

    // Check that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);
    const createdEntry = response.json(); // Parse the response body as JSON
    expect(createdEntry).toMatchObject(expect.objectContaining({
      title: newEntry.title,
      description: newEntry.description
    }));

    // Store the created entry's ID for further tests
    createdEntryId = createdEntry.id;

    // Verify the entry was created in the database
    const dbEntry = await prisma.entry.findUnique({ where: { id: createdEntryId } });
    expect(dbEntry).toMatchObject(expect.objectContaining(newEntry));
  });

  // Test for retrieving a specific entry by ID
  test('GET /get/:id should return a specific entry', async () => {
    // Create a test entry in the database
    const newEntry = await prisma.entry.create({
      data: {
        title: 'Specific Test Entry',
        description: 'This is a specific test entry',
        created_at: new Date(),
        scheduledDate: new Date()
      }
    });

    // Send a GET request to the /get/:id endpoint with the entry's ID
    const response = await app.inject({
      method: 'GET',
      url: `/get/${newEntry.id}`
    });

    // Check that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);
    const retrievedEntry = response.json(); // Parse the response body as JSON
    expect(retrievedEntry).toMatchObject(expect.objectContaining({
      id: newEntry.id,
      title: newEntry.title,
      description: newEntry.description
    }));
  });

  // Test for updating an entry by ID
  test('PUT /update/:id should update an entry', async () => {
    // Create a test entry in the database
    const newEntry = await prisma.entry.create({
      data: {
        title: 'Entry to Update',
        description: 'This entry will be updated',
        created_at: new Date(),
        scheduledDate: new Date()
      }
    });

    const updatedData = {
      title: 'Updated Test Entry',
      description: 'This is an updated test entry',
      scheduledDate: new Date().toISOString() // Ensure the date matches the returned ISO string format
    };

    // Send a PUT request to the /update/:id endpoint with the updated data
    const response = await app.inject({
      method: 'PUT',
      url: `/update/${newEntry.id}`,
      payload: updatedData
    });

    // Check that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);

    const updatedEntry = response.json(); // Parse the response body as JSON

    // Verify the updated entry matches the expected data
    expect(updatedEntry).toMatchObject({
      title: updatedData.title,
      description: updatedData.description,
      scheduledDate: updatedData.scheduledDate
    });

    // Verify the update in the database
    const dbUpdatedEntry = await prisma.entry.findUnique({ where: { id: newEntry.id } });
    expect(dbUpdatedEntry).toMatchObject({
      title: updatedData.title,
      description: updatedData.description,
      scheduledDate: new Date(updatedData.scheduledDate)
    });
  });

  //Test for deleting an entry by ID
  test('DELETE /delete/:id should delete an entry', async () => {
    // Create a test entry in the database
    const newEntry = await prisma.entry.create({
      data: {
        title: 'Entry to Delete',
        description: 'This entry will be deleted',
        created_at: new Date(),
        scheduledDate: new Date()
      }
    });

    // Send a DELETE request to the /delete/:id endpoint with the entry's ID
    const response = await app.inject({
      method: 'DELETE',
      url: `/delete/${newEntry.id}`
    });

    // Check that the status code is 200 (OK)
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ msg: 'Deleted successfully' });

    // Verify the deletion in the database
    const deletedEntry = await prisma.entry.findUnique({ where: { id: newEntry.id } });
    expect(deletedEntry).toBeNull(); // The entry should no longer exist in the database
  });

});
