import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        token?: string | null;
        username?: string | null;
      }
    
      interface Session {
        user: {
          id: string;
          username?: string | null;
        } & DefaultSession["user"];
        accessToken?: string | null;
      }

    interface User extends DefaultUser {
        id: string; 
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username?: string | null;
        accessToken?: string | null;
      }
  }