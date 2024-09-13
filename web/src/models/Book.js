import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  coverImageUrl: { type: String },
  pdfUrl: { type: String },
  adminEmail: { type: String, required: true }, // To relate the book to the admin
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
