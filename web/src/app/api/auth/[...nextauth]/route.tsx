import NextAuth, { NextAuthOptions, User as NextAuthUser, Account, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import User from "@/models/User";
import connect from "@/utils/db";

// Extend NextAuth types to include 'role'
declare module "next-auth" {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

export const authOptions: NextAuthOptions = {
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
          throw new Error("Missing credentials");
        }
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
            if (isPasswordCorrect) {
<<<<<<< HEAD
              return { ...user._doc, id: user._id }; // Spread the user document and add the 'id'
            } else {
              throw new Error("Invalid password");
=======
              return { ...user._doc, id: user._id };
>>>>>>> c33abf4adc5faaee542cfcb7f7e46a7aa162d2d5
            }
          } else {
            throw new Error("No user found with this email");
          }
        } catch (err) {
          console.error("Error during credentials authorization:", err);
          throw new Error("Authorization failed");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: NextAuthUser; account: Account | null }) {
      if (account?.provider === "google") {
        await connect();
        try {
          const existingUser = await User.findOne({ email: user.email });
          if (!existingUser) {
            const newUser = new User({
              email: user.email,
              name: user.name,
              image: user.image,
              role: "user", // Default role
            });
            await newUser.save();
            user.role = "user"; // Assign default role to new Google user
          } else {
            user.role = existingUser.role; // Set role from the existing user data
          }
          return true;
        } catch (err) {
          console.error("Error during Google sign-in:", err);
          return false;
        }
      }
<<<<<<< HEAD
      return true; // Return true to allow credential-based sign-in
=======
      return true; // Always return true to allow sign-in with credentials
>>>>>>> c33abf4adc5faaee542cfcb7f7e46a7aa162d2d5
    },
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      if (user) {
        token.role = user.role || 'user'; // Add user role to JWT token
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.role = token.role; // Add role to session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export the NextAuth handler with GET and POST methods
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
