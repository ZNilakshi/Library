import NextAuth from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connect from "@/utils/db";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordCorrect) {
              return { ...user._doc, id: user._id }; // Ensure id is included
            }
          }
          return null;
        } catch (err) {
          console.error("Error during credentials authorization:", err);
          throw new Error("Authorization failed");
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
      if (account.provider === "credentials") {
        return true;
      }

      if (account.provider === "google") {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              name: user.name,  // Include name from Google
              image: user.image, // Include image from Google
              role: 'user',      // Default role
            });
            await newUser.save();
            user.role = 'user';  // Set the role for the new user
          } else {
            user.role = existingUser.role; // Set the role for the existing user
          }
          return true;
        } catch (err) {
          console.error("Error during Google sign-in:", err);
          return false;
        }
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'user'; // Ensure role is set, with a default fallback
      }
      console.log("JWT Callback", token);
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      console.log("Session Callback", session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
