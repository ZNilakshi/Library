// pages/api/updateProfile.js
import { NextRequest, NextResponse } from 'next/server';
import connect from '../../../utils/db';
import User from '../../../models/User';
import { uploadImage } from '../../../utils/cloudinary';

export const GET = async (req: NextRequest) => {
  await connect(); // Ensure DB connection

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email'); // Assuming email is used to fetch the user

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  await connect(); // Ensure DB connection

  try {
    const formData = await req.formData();
    const email = formData.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const name = formData.get('name');
    const country = formData.get('country');
    const favoriteBook = formData.get('favoriteBook');
    const profilePhotoFile = formData.get('profilePhoto');

    let profilePhotoUrl = user.profilePhoto;

    if (profilePhotoFile instanceof File) {
      const arrayBuffer = await profilePhotoFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');
      profilePhotoUrl = await uploadImage(`data:${profilePhotoFile.type};base64,${base64Image}`);
    }

    // Update user data
    user.name = name || user.name;
    user.country = country || user.country;
    user.favoriteBook = favoriteBook || user.favoriteBook;
    user.profilePhoto = profilePhotoUrl;

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
};