import { NextResponse ,  NextRequest  } from 'next/server';
import connect from '../../../../utils/db';
import Book from '../../../../models/Book';
import { cloudinary } from '../../../../utils/cloudinary'; // Import the cloudinary instance

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connect();
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
  }

  try {
    const book = await Book.findById(id).exec();

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Ensure the PDF URL is correct
    if (book.pdfUrl) {
      return NextResponse.json({ book }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching book:', error);
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 });
  }
};
export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connect();

  try {
    const formData = await req.formData();

    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;

    if (!title || !author || !description || !category) {
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

     // Upload new cover image if provided
     if (coverImageFile instanceof File) {
      const coverImageBuffer = await coverImageFile.arrayBuffer();
      const coverImageUpload = await cloudinary.uploader.upload(
        `data:${coverImageFile.type};base64,${Buffer.from(coverImageBuffer).toString('base64')}`,
        {
          folder: 'book_covers',
        }
      );
      updatedData.coverImageUrl = coverImageUpload.secure_url;
    }
     // Upload new PDF if provided
     if (pdfFile instanceof File) {
      const pdfBuffer = await pdfFile.arrayBuffer();
      const pdfUpload = await cloudinary.uploader.upload(
        `data:${pdfFile.type};base64,${Buffer.from(pdfBuffer).toString('base64')}`,
        {
          folder: 'book_pdfs',
          resource_type: 'raw',
        }
      );
      updatedData.pdfUrl = pdfUpload.secure_url;
    }
    // Update the book in the database
    const updatedBook = await Book.findByIdAndUpdate(params.id, updatedData, { new: true });

    if (!updatedBook) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Book updated successfully', book: updatedBook }, { status: 200 });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  await connect();

  try {
    const bookId = params.id;

    if (!bookId) {
      console.error('Book ID is missing');
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // Find the book to get the Cloudinary public IDs
    const book = await Book.findById(bookId);

    if (!book) {
      console.error(`Book with ID ${bookId} not found`);
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Delete associated files from Cloudinary
    if (book.coverImageUrl) {
      try {
        const publicId = book.coverImageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`book_covers/${publicId}`);
        console.log(`Deleted cover image from Cloudinary: ${publicId}`);
      } catch (error) {
        console.error('Error deleting cover image from Cloudinary:', error);
        // Continue even if Cloudinary deletion fails
      }
    }

    if (book.pdfUrl) {
      try {
        const publicId = book.pdfUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`book_pdfs/${publicId}`, { resource_type: 'raw' });
        console.log(`Deleted PDF from Cloudinary: ${publicId}`);
      } catch (error) {
        console.error('Error deleting PDF from Cloudinary:', error);
        // Continue even if Cloudinary deletion fails
      }
    }

    // Delete the book from the database
    await Book.findByIdAndDelete(bookId);

    console.log(`Book with ID ${bookId} deleted successfully`);
    return NextResponse.json({ message: 'Book deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
};
