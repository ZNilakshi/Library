import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    role: { 
      type: String, 
      enum: ['user', 'admin'], 
      default: 'user',
    },
    name: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    favoriteBook: {
      type: String,
      required: false,
    },
    profilePhoto: {
      type: String, 
      required: false,
    },
    downloads: [
      {
        bookId: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Book',
                  },
        downloadedAt: { 
          type: Date, 
          default: Date.now 
        },
      },
    ],
    favorites: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
          // No need to make bookId required here either, handle in app logic if needed
        },
      },
    ],
    
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
