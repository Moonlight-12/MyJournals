import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Extend the User interface
   */
  interface User extends DefaultUser {
    id: string;
    token?: string | null;
    username?: string | null;
  }

  /**
   * Extend the Session interface
   */
  interface Session {
    user: {
      id: string;
      username?: string | null;
    } & DefaultSession["user"];
    accessToken?: string | null;
    exp?: number; // Add the expiration time
  }
}

declare module "next-auth/jwt" {
  /**
   * Extend the JWT interface
   */
  interface JWT {
    id: string;
    username?: string | null;
    accessToken?: string | null;
    provider?: string;
    exp?: number; // Add the expiration time
  }
}