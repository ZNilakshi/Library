import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '../../../utils/db';
import User from '../../../models/User';
import multer from 'multer';
import path from 'path';

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create Multer instance
const upload = multer({ storage });

export async function PUT(req) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  // Middleware to handle file upload
  const uploadMiddleware = upload.single('profilePhoto');

  return new Promise((resolve, reject) => {
    uploadMiddleware(req, {}, async (err) => {
      if (err) {
        return reject(
          NextResponse.json({ message: 'Error uploading photo', error: err }, { status: 500 })
        );
      }

      try {
        const { name, country, favoriteBook } = req.body;
        const email = session.user?.email;

        if (!email) {
          return resolve(
            NextResponse.json({ message: 'User email not found' }, { status: 400 })
          );
        }

        let profilePhoto = req.file ? `/uploads/${req.file.filename}` : undefined;

        const updatedUser = await User.findOneAndUpdate(
          { email },
          { name, country, favoriteBook, profilePhoto },
          { new: true }
        );

        return resolve(NextResponse.json({ user: updatedUser }));
      } catch (error) {
        return reject(
          NextResponse.json({ message: 'Error updating profile', error }, { status: 500 })
        );
      }
    });
  });
}
