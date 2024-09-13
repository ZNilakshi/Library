import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../../utils/db';
import User from '../../../../../models/User';
import Book from '../../../../../models/Book';

// GET: Fetch all favorite books for a user by email
export async function GET(req, { params }) {
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
export async function POST(req, { params }) {
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

    // Check if the book is already in the user's favorites
    const alreadyFavorite = user.favorites.some(favorite => favorite.bookId.equals(bookId));
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
