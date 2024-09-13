import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import { promisify } from 'util';
import connect from '../../../utils/db';
import Book from '../../../models/Book';

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${sanitizedFileName}`);
  },
});

const upload = multer({ storage: storage });
const uploadMiddleware = promisify(upload.fields([{ name: 'coverImage' }, { name: 'pdf' }]));

export const GET = async (req) => {
  await connect();
  const { searchParams } = new URL(req.url);
  const adminEmail = searchParams.get('adminEmail');
  const category = searchParams.get('category');

  let filter = {};
  if (adminEmail) filter.adminEmail = adminEmail;
  if (category) {
    // Use case-insensitive regex search for category
    filter.category = { $regex: new RegExp(category, 'i') };
  }

  try {
    const books = await Book.find(filter);
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
};

export const POST = async (req) => {
  await connect();
  try {
    await uploadMiddleware(req, null);

    const formData = await req.formData();
    const title = formData.get('title');
    const author = formData.get('author');
    const description = formData.get('description');
    let category = formData.get('category');
    const adminEmail = formData.get('adminEmail');

    if (!title || !author || !description || !category || !adminEmail) {
      return NextResponse.json({ error: 'All book fields are required' }, { status: 400 });
    }

    category = category.toLowerCase(); // Save category as lowercase

    const coverImage = formData.has('coverImage') ? `/uploads/${formData.get('coverImage').name}` : null;
    const pdf = formData.has('pdf') ? `/uploads/${formData.get('pdf').name}` : null;

    const newBook = new Book({
      title,
      author,
      description,
      category,
      coverImageUrl: coverImage,
      pdfUrl: pdf,
      adminEmail,
    });

    await newBook.save();

    return NextResponse.json({ message: 'Book added successfully', book: newBook }, { status: 201 });
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json({ error: 'Failed to add book' }, { status: 500 });
  }
};

export const PUT = async (req) => {
  await connect();

  try {
    await uploadMiddleware(req, null);

    const formData = await req.formData();
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('id');

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    let category = formData.get('category');
    if (category) category = category.toLowerCase(); // Convert to lowercase

    const updatedData = {
      title: formData.get('title'),
      author: formData.get('author'),
      description: formData.get('description'),
      category,
      coverImageUrl: formData.has('coverImage') ? `/uploads/${formData.get('coverImage').name}` : undefined,
      pdfUrl: formData.has('pdf') ? `/uploads/${formData.get('pdf').name}` : undefined,
    };

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedData, { new: true });

    if (!updatedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book updated successfully', book: updatedBook }, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  await connect();

  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get('id');

    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
};
