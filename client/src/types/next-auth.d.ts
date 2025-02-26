import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string; 
            email: string;
            name?: string;
            image?: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string; 
    }
}