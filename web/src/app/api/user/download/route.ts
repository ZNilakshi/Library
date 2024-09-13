import { NextResponse } from 'next/server';
import connect from '../../../../utils/db'; // Ensure the correct path to db.js
import User from '../../../../models/User';
import Book from '../../../../models/Book'; // Make sure you have the Book model

// For GET requests
export async function GET(req) {
  try {
    // Extract email parameter from query string
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Check if the email parameter is provided
    if (!email) {
      return new Response(JSON.stringify({ error: "Email parameter is required" }), { status: 400 });
    }

    // Connect to the database
    await connect();

    // Find user and populate downloads
    const user = await User.findOne({ email }).populate('downloads');

    // Check if the user exists
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Return user's downloads
    return new Response(JSON.stringify({ downloads: user.downloads }), { status: 200 });
  } catch (error) {
    console.error("Error fetching downloads:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

// For POST requests
export async function POST(req) {
  try {
    // Read and parse the request body
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    const { email, bookId } = body;

    // Check for required fields
    if (!email || !bookId) {
      return new Response(JSON.stringify({ error: "Missing required fields: email and bookId" }), { status: 400 });
    }

    // Connect to the database
    await connect();

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Find the book by ID
    const book = await Book.findById(bookId);
    if (!book) {
      return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
    }

    // Add the book to the user's downloads
    user.downloads.push(bookId);
    await user.save();

    // Respond with success
    return new Response(JSON.stringify({ message: "Download added successfully" }), { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/user/downloads:', error);
    return new Response(JSON.stringify({ error: "Failed to update downloads" }), { status: 500 });
  }
}
