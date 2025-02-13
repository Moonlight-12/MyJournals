import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;  // Add custom user ID field
            email: string;
            name?: string;
            image?: string;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id: string;  // Ensure ID is available in the User object
    }
}