import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  description: { type: String }, // Optional field for book description
  category: { type: String }, // Optional field for book category
  coverPhoto: { type: String }, // URL or path to the cover photo
  pdf: { type: String }, // URL or path to the PDF file
}, { timestamps: true });

const Book = mongoose.models.Book || mongoose.model('Book', BookSchema);

export default Book;
