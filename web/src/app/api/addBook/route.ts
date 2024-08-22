import { default as nextConnect } from 'next-connect';
import multer from 'multer';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Initialize Multer for file handling with memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Next.js handler using nextConnect
const handler = nextConnect();

// Use Multer middleware for handling multipart form data
handler.use(upload.fields([{ name: 'coverPhoto', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]));

// Helper function to connect to the database
async function connectToDatabase() {
  const client = await MongoClient.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return { client, db: client.db() };
}

// POST request handler to add a book
handler.post(async (req, res) => {
  const { name, title, description, category, author } = req.body;
  const { coverPhoto, pdf } = req.files;

  // Validate required fields
  if (!name || !title || !author || !category) {
    return res.status(400).json({ message: 'Please fill out all required fields.' });
  }

  // Connect to the database
  const { client, db } = await connectToDatabase();

  try {
    // Save the book details in the database
    const newBook = {
      name,
      title,
      description,
      category,
      author,
      coverPhoto: coverPhoto ? `/uploads/${coverPhoto[0].originalname}` : '',
      pdf: pdf ? `/uploads/${pdf[0].originalname}` : '',
    };

    const result = await db.collection('books').insertOne(newBook);

    // Define the directory for file uploads
    const uploadsDir = path.join(process.cwd(), 'public/uploads');

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save the cover photo and PDF files to the file system
    if (coverPhoto) {
      fs.writeFileSync(path.join(uploadsDir, coverPhoto[0].originalname), coverPhoto[0].buffer);
    }

    if (pdf) {
      fs.writeFileSync(path.join(uploadsDir, pdf[0].originalname), pdf[0].buffer);
    }

    res.status(201).json({ message: 'Book added successfully!', book: result.ops[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding book.' });
  } finally {
    client.close();
  }
});

// Disable Next.js default body parsing since Multer will handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
