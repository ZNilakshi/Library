import { MongoClient } from 'mongodb';

// A helper function to connect to the database
async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGO_URL);
  return { client, db: client.db() };
}

// GET request handler to fetch books
export async function GET(req, res) {
  const { client, db } = await connectToDatabase();

  try {
    const books = await db.collection('books').find({}).toArray();
    return res.status(200).json(books);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching books.' });
  } finally {
    client.close();
  }
}
