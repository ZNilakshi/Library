import { NextResponse, NextRequest } from 'next/server';
import connect from '../../../utils/db';
import Book from '../../../models/Book';
import { cloudinary, uploadFile } from '../../../utils/cloudinary'; // Import the cloudinary instance and uploadFile function

export const GET = async (req: NextRequest) => {
  await connect();
  const { searchParams } = new URL(req.url);
  const adminEmail = searchParams.get('adminEmail');
  const category = searchParams.get('category');

  let filter: { adminEmail?: string; category?: { $regex: RegExp } } = {};
  if (adminEmail) filter.adminEmail = adminEmail;
  if (category) {
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

export const POST = async (req: NextRequest) => {
  await connect();

  try {
    const formData = await req.formData();

    // Log form data for debugging
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const title = formData.get('title');
    const author = formData.get('author');
    const description = formData.get('description');
    let category = formData.get('category');
    const adminEmail = formData.get('adminEmail');

    if (!title || !author || !description || !category || !adminEmail) {
      return NextResponse.json(
        { error: 'All book fields are required' },
        { status: 400 }
      );
    }

    if (typeof category === 'string') {
      category = category.toLowerCase();
    }
    
    const coverImageFile = formData.get('coverImage');
    const pdfFile = formData.get('pdf');

    let coverImageUrl = null;
    let pdfUrl = null;

    // Upload cover image to Cloudinary
    if (coverImageFile) {
      try {
        coverImageUrl = await uploadFile(coverImageFile, 'book_covers');
      } catch (error) {
        console.error('Error uploading cover image:', error);
        return NextResponse.json(
          { error: 'Failed to upload cover image' },
          { status: 500 }
        );
      }
    }

    // Upload PDF to Cloudinary
    if (pdfFile) {
      try {
        pdfUrl = await uploadFile(pdfFile, 'book_pdfs', 'raw');
      } catch (error) {
        console.error('Error uploading PDF:', error);
        return NextResponse.json(
          { error: 'Failed to upload PDF' },
          { status: 500 }
        );
      }
    }

    // Save book to database
    const newBook = new Book({
      title,
      author,
      description,
      category,
      coverImageUrl,
      pdfUrl,
      adminEmail,
    });

    await newBook.save();

    return NextResponse.json(
      { message: 'Book added successfully', book: newBook },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding book:', error);
    return NextResponse.json(
      { error: 'Failed to add book' },
      { status: 500 }
    );
  }
};
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connect();

  try {
    console.log('Received request to update book:', params.id);

    const formData = await req.formData();
    console.log('Form Data:', {
      title: formData.get('title'),
      author: formData.get('author'),
      description: formData.get('description'),
      category: formData.get('category'),
      coverImage: formData.get('coverImage') ? 'File present' : 'No file',
      pdf: formData.get('pdf') ? 'File present' : 'No file',
    });

    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!title || !author || !description || !category) {
      console.error('Missing required fields');
      return NextResponse.json({ error: 'All book fields are required' }, { status: 400 });
    }

    const updatedData: any = {
      title,
      author,
      description,
      category: category.toLowerCase(),
    };

    const coverImageFile = formData.get('coverImage');
    const pdfFile = formData.get('pdf');

    if (coverImageFile) {
      console.log('Uploading cover image...');
      const coverImageBuffer = await (coverImageFile as File).arrayBuffer();
      const coverImageUpload = await cloudinary.uploader.upload(
        `data:${(coverImageFile as File).type};base64,${Buffer.from(coverImageBuffer).toString('base64')}`,
        {
          folder: 'book_covers',
        }
      );
      updatedData.coverImageUrl = coverImageUpload.secure_url;
      console.log('Cover image uploaded:', updatedData.coverImageUrl);
    }

    if (pdfFile) {
      console.log('Uploading PDF...');
      const pdfBuffer = await (pdfFile as File).arrayBuffer();
      const pdfUpload = await cloudinary.uploader.upload(
        `data:${(pdfFile as File).type};base64,${Buffer.from(pdfBuffer).toString('base64')}`,
        {
          folder: 'book_pdfs',
          resource_type: 'raw',
        }
      );
      updatedData.pdfUrl = pdfUpload.secure_url;
      console.log('PDF uploaded:', updatedData.pdfUrl);
    }

    console.log('Updating book in database...');
    const updatedBook = await Book.findByIdAndUpdate(params.id, updatedData, { new: true });

    if (!updatedBook) {
      console.error('Book not found');
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    console.log('Book updated successfully:', updatedBook);
    return NextResponse.json({ message: 'Book updated successfully', book: updatedBook }, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
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