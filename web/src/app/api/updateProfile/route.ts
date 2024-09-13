import { NextRequest, NextResponse } from 'next/server';
import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { promisify } from 'util';
import connect from '../../../utils/db';
import User from '../../../models/User';
import type { IncomingMessage } from 'http';

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads'); // Save files in 'public/uploads' folder
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_').replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${sanitizedFileName}`);
  },
});

const upload = multer({ storage: storage });

// Custom middleware to handle Multer file uploads in Next.js
const multerMiddleware = upload.single('profilePhoto');

function runMiddleware(req: IncomingMessage & NextApiRequest, res: NextApiResponse, fn: Function) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// GET: Fetch user profile data
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

// PUT: Update user profile data
export const PUT = async (req: NextRequest, res: NextApiResponse) => {
  await connect(); // Ensure DB connection

  try {
    // Convert NextRequest to NextApiRequest and run Multer middleware
    await runMiddleware(req as unknown as IncomingMessage & NextApiRequest, res, multerMiddleware);

    const formData = await req.formData();
    console.log('Form Data:', formData); // Debug log
    console.log('Uploaded File:', formData.get('profilePhoto')); // Debug log for file

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
    const profilePhoto = formData.has('profilePhoto')
      ? `/uploads/${(formData.get('profilePhoto') as any).name}`
      : null;

    // Update user data
    user.name = name || user.name;
    user.country = country || user.country;
    user.favoriteBook = favoriteBook || user.favoriteBook;
    user.profilePhoto = profilePhoto;

    await user.save();

    return NextResponse.json({ message: 'Profile updated successfully', user }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error); // Log the error for debugging
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
};
