import mongoose from "mongoose";

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
      type: String, // URL to the photo
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
