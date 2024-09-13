import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../utils/db';
import User from '../../../../../models/User';
import Book from '../../../../../models/Book';
import { NextRequest } from 'next/server'; // Import NextRequest type

// Define types for params
interface Params {
  email: string;
}

// Define type for favorite in User model (Assuming it's a structure like { bookId: mongoose.Schema.Types.ObjectId })
interface Favorite {
  bookId: mongoose.Schema.Types.ObjectId;
}

// GET: Fetch all favorite books for a user by email
export async function GET(req: NextRequest, { params }: { params: Params }) {
  try {
    const email = params.email; // Get email from URL

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email }).populate('favorites.bookId');
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.favorites || user.favorites.length === 0) {
      return NextResponse.json({ message: 'No favorite books found' }, { status: 404 });
    }

    return NextResponse.json({ favorites: user.favorites }, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

// POST: Add a book to the user's favorites
export async function POST(req: NextRequest, { params }: { params: Params }) {
  await dbConnect();
  try {
    const { email, bookId } = await req.json();

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

    // Initialize favorites if undefined
    if (!user.favorites) {
      user.favorites = [];
    }

    // Check if the book is already in the user's favorites using `toString()` for comparison
    const alreadyFavorite = user.favorites.some((favorite: Favorite) => favorite.bookId.toString() === bookId.toString());
    if (alreadyFavorite) {
      return NextResponse.json({ message: 'Book is already in favorites' }, { status: 200 });
    }

    // Add the book to the user's favorites
    user.favorites.push({ bookId });
    await user.save();

    return NextResponse.json({ message: 'Book added to favorites successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to add book to favorites:', error);
    return NextResponse.json({ error: 'Failed to add book to favorites' }, { status: 500 });
  }
}
