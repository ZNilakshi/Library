import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

declare module "next-auth" {
  interface Session {
    user: {
      name: string;
      image: string;
      id: string;
      email: string;
      role: string;  // Add role to the session type
    };
  }

  interface User {
    id: string;
    email: string;
    role: string;  // Add role to the user type
  }
}
// Auth options configuration
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        await connect();  // Ensure DB is connected

        try {
          const user = await User.findOne({ email: credentials.email });

          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordCorrect) {
              return { ...user._doc, id: user._id }; // Ensure id is included
            }
          }
          return null; // Return null if user not found or incorrect password
        } catch (err) {
          throw new Error(err instanceof Error ? err.message : "Unknown error during authentication");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Ensure account is not null or undefined before proceeding
      if (!account) {
        return false;
      }

      await connect();

      if (account.provider === "credentials") {
        return true;
      }

      if (account.provider === "google") {
        try {
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              role: "user", // Assign default role to new users
            });
            await newUser.save();
            user.role = "user"; // Assign role to the session user
          } else {
            user.role = existingUser.role; // Existing user keeps their role
          }
          
          return true;
        } catch (error) {
          console.error("Error in Google sign-in:", error);
          return false;
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      // Include role information in the token if the user exists
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach role to the session user
      if (token) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the handler to be used with the app directory routing in Next.js 13+
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
