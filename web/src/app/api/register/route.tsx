// src/app/api/register/route.tsx
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connect from '@/utils/db';
import User from '@/models/User';

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  try {
    // Connect to the database
    await connect();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
