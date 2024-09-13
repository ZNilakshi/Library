import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../utils/db';
import User from '../../../../models/User';
import Book from '../../../../models/Book';
import { NextRequest, NextResponse as NextRes } from 'next/server'; // Import types

// GET handler
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url); // Correct way to handle query params
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email }).populate({
      path: 'favorites.bookId',
      select: 'title author category coverImageUrl pdfUrl'
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.favorites || user.favorites.length === 0) {
      return NextResponse.json({ message: 'No favorite books found', favorites: [] }, { status: 200 });
    }

    return NextResponse.json({ favorites: user.favorites }, { status: 200 });
  } catch (error: unknown) { // Explicitly typing error as unknown
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST handler
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { email, bookId } = await req.json();
    console.log('Received email:', email);
    console.log('Received bookId:', bookId); 

    if (!email || !bookId) {
      return NextResponse.json({ error: 'Email and Book ID are required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Filter valid entries
    user.favorites = user.favorites.filter((favorite: { bookId: mongoose.Types.ObjectId }) => favorite.bookId);

    const alreadyFavorite = user.favorites.some((favorite: { bookId: mongoose.Types.ObjectId }) => favorite.bookId?.toString() === bookObjectId.toString());
    if (alreadyFavorite) {
      return NextResponse.json({ message: 'Book is already in favorites' }, { status: 200 });
    }

    user.favorites.push({ bookId: bookObjectId });

    await user.save();

    return NextResponse.json({ message: 'Book added to favorites successfully', favorites: user.favorites }, { status: 200 });
  } catch (error: unknown) { // Explicitly typing error as unknown
    console.error('Failed to add book to favorites:', error);
    return NextResponse.json({ error: 'Failed to add book to favorites', details: (error as Error).message }, { status: 500 });
  }
}
