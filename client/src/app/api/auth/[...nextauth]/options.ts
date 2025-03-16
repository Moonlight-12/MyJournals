import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt, { type JwtPayload } from "jsonwebtoken"

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
          return null
        }

        try {
          const response = await fetch("http://localhost:4000/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          })

          if (!response.ok) {
            return null
          }

          const user = await response.json()

          if (!user || !user.id) return null

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            token: user.token ?? null,
          }
        } catch (error) {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign-in
      if (account && user) {
        // For credential provider
        if (account.type === "credentials" && user.token) {
          const decodedToken = jwt.decode(user.token) as JwtPayload

          return {
            ...token,
            id: String(user.id),
            username: user.name ?? null,
            accessToken: user.token,
            exp: decodedToken?.exp,
          }
        }

        // For OAuth providers (like GitHub)
        if (account.type === "oauth") {
          try {
            // Use environment variable for API URL
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

            // Call your signin endpoint to get a proper token
            const signinResponse = await fetch(`${API_URL}/api/auth/signin`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email || "",
                name: user.name || "",
                provider: account.provider,
              }),
            })

            if (!signinResponse.ok) {
              console.error("Error getting token for OAuth user:", await signinResponse.text())
              return token
            }

            const userData = await signinResponse.json()
            console.log("Got token for OAuth user:", userData)

            return {
              ...token,
              id: userData.id.toString(), // Ensure it's a string
              username: userData.username,
              accessToken: userData.token, // Use your server's token
              provider: account.provider,
            }
          } catch (error) {
            console.error("Error in OAuth token generation:", error)
            return token
          }
        }
      }

      return token
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
        }
      }

      return session
    },
  },

  // Remove the signIn event handler since we're handling token generation in the jwt callback
  events: {
    async updateUser({ user }) {
      console.log("User updated:", user)
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
}

