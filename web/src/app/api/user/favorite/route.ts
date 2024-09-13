import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '../../../../utils/db';
import User from '../../../../models/User';
import Book from '../../../../models/Book';


export default async function handler(req, res) {
  await dbConnect();

  const { email } = req.query;

  try {
    const user = await User.findOne({ email })
      .populate('favorites.bookId')  // Populate the book details
      .exec();

    if (user) {
      const favoriteBooks = user.favorites.map(favorite => favorite.bookId); // Extract the book details
      return res.status(200).json({ favorites: favoriteBooks });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function POST(req) {
  await dbConnect(); // Connect to the database

  try {
    const { email, bookId } = await req.json();
    console.log('Received email:', email);
    console.log('Received bookId:', bookId); // Log bookId to verify

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

    console.log('Fetched Book:', book);

    // Convert bookId to ObjectId
    const bookObjectId = new mongoose.Types.ObjectId(bookId);

    // Clean up the user's favorites to ensure all entries have a valid bookId
    user.favorites = user.favorites.filter(favorite => favorite.bookId);

    // Check if the book is already in the user's favorites
    const alreadyFavorite = user.favorites.some(favorite => favorite.bookId?.toString() === bookObjectId.toString());
    if (alreadyFavorite) {
      return NextResponse.json({ message: 'Book is already in favorites' }, { status: 200 });
    }

    // Add the book to the user's favorites
    user.favorites.push({ bookId: bookObjectId });
    console.log('User favorites after adding:', user.favorites);

    await user.save();

    return NextResponse.json({ message: 'Book added to favorites successfully', favorites: user.favorites }, { status: 200 });
  } catch (error) {
    console.error('Failed to add book to favorites:', error);
    return NextResponse.json({ error: 'Failed to add book to favorites', details: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ email }).populate({
      path: 'favorites.bookId',
      select: 'title author category coverImageUrl pdfUrl' // Select the necessary fields
    });
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.favorites || user.favorites.length === 0) {
      return NextResponse.json({ message: 'No favorite books found', favorites: [] }, { status: 200 });
    }

    return NextResponse.json({ favorites: user.favorites }, { status: 200 });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
