import { NextResponse, NextRequest } from 'next/server'; // Use NextRequest for req typing
import multer from 'multer';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import connect from '../../../../utils/db';
import Book from '../../../../models/Book';

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${sanitizedFileName}`);
  },
});

const upload = multer({ storage });
const uploadMiddleware = promisify(upload.fields([{ name: 'coverImage' }, { name: 'pdf' }]));

// GET: Fetch a single book by ID
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connect();
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const book = await Book.findById(id).exec();

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ book }, { status: 200 });
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
};

// PUT: Update book by ID
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!title || !author || !description || !category) {
      return NextResponse.json({ error: 'All book fields are required' }, { status: 400 });
    }

    const updatedData: any = {
      title,
      author,
      description,
      category,
    };

    if (formData.has('coverImage')) {
      const coverImage = formData.get('coverImage');
      if (coverImage instanceof File) {
        updatedData.coverImageUrl = `/uploads/${coverImage.name}`;
      }
    }

    if (formData.has('pdf')) {
      const pdf = formData.get('pdf');
      if (pdf instanceof File) {
        updatedData.pdfUrl = `/uploads/${pdf.name}`;
      }
    }

    // Update the book in the database
    const updatedBook = await Book.findByIdAndUpdate(params.id, updatedData, { new: true });

    if (!updatedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book updated successfully', book: updatedBook }, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
};

// DELETE: Delete book by ID
export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connect();

  try {
    const bookId = params.id;

    if (!bookId) {
      console.error('Book ID is missing');
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Log the bookId to ensure it is correct
    console.log(`Deleting book with ID: ${bookId}`);

    const book = await Book.findById(bookId);

    if (!book) {
      console.error(`Book with ID ${bookId} not found`);
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Optionally delete associated files (coverImage and PDF)
    if (book.coverImageUrl) {
      const coverImagePath = path.join(process.cwd(), 'public', book.coverImageUrl);
      if (fs.existsSync(coverImagePath)) {
        fs.unlinkSync(coverImagePath);
      }
    }

    if (book.pdfUrl) {
      const pdfPath = path.join(process.cwd(), 'public', book.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(bookId);

    console.log(`Book with ID ${bookId} deleted successfully`);
    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
};
