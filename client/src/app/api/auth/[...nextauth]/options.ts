import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          const response = await fetch(
            "http://localhost:4000/api/auth/signin",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(credentials),
            }
          );

          if (!response.ok) {
            return null;
          }

          const user = await response.json();

          if (!user || !user.id) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            token: user.token ?? null,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: String(user.id),
          username: user.name ?? null,
          accessToken: user.token ?? null,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: String(token.id),
            name: token.username,
          },
          accessToken: token.accessToken ?? null,
        };
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};
