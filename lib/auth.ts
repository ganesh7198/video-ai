import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { connectToDataBase } from "./db";
import User from "@/app/models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password.");
        }

        try {
          await connectToDataBase();

          const existingUser = await User.findOne({
            email: credentials.email,
          });

          if (!existingUser) {
            throw new Error("User does not exist.");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Invalid password.");
          }

          return {
            id: existingUser._id.toString(),
            email: existingUser.email,
          };
        } catch (error) {
          console.error("Login Error:", error);
          throw new Error("Authentication failed.");
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
	error:"/login"
  },
    
  secret: process.env.NEXTAUTH_SECRET,
};