import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
        clientId: process.env.GITHUB_ID as string,
        clientSecret: process.env.GITHUB_SECRET as string,
        // check if it works without these line of codes
        // authorization: {
        //   url: "https://github.com/login/oauth/authorize",
        //   params: { scope: "read:user user:email" },
        // },
        // userinfo: "https://api.github.com/user",
        // profile(profile) {
        //   console.log("🔍 GitHub Profile:", profile);
        //   return {
        //     id: profile.id.toString(),
        //     name: profile.name || profile.login,
        //     email: profile.email,
        //     image: profile.avatar_url,
        //   };
        // },
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
          
          const response = await fetch("http://localhost:4000/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
  
          if (!response.ok) {
            return null;
          }
      
          const user = await response.json();
          return user;
        } catch (error) {
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;  // Store user ID in JWT
      }
      return token;
    },
  
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;  // Ensure session has user ID
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
