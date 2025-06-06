import type { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import jwt, { type JwtPayload } from "jsonwebtoken"

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
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
        
        const API_URL = process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:4000"

        // Debug logs
  console.log('=== NextAuth Debug ===');
  console.log('API_URL:', API_URL);
  console.log('Full URL:', `${API_URL}/api/auth/signin`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('===================');
        
        try {
          const response = await fetch(`${API_URL}/api/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          })

          if (!response.ok) {
            console.error("Credentials signin failed:", response.status, await response.text())
            return null
          }

          const user = await response.json()

          if (!user || !user.id) {
            console.error("Invalid user data received")
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.username,
            token: user.token ?? null,
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  
  callbacks: {
    async jwt({ token, user, account }) {
      const API_URL = process.env.NEXT_PUBLIC_APP_API_URL || "http://localhost:4000"
      
      // If this is a sign-in
      if (account && user) {
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

        if (account.type === "oauth") {
          try {
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
              console.error("OAuth signin failed:", await signinResponse.text())
              return token
            }

            const userData = await signinResponse.json()
            const decodedToken = jwt.decode(userData.token) as JwtPayload

            return {
              ...token,
              id: userData.id.toString(),
              username: userData.username,
              accessToken: userData.token,
              provider: account.provider,
              exp: decodedToken?.exp,
            }
          } catch (error) {
            console.error("Error in OAuth token generation:", error)
            return token
          }
        }
      }

      // Token refresh logic (optional)
      if (token.exp && token.accessToken) {
        const currentTime = Math.floor(Date.now() / 1000)
        
        // If token expires in less than 5 minutes, try to refresh
        if (currentTime > (token.exp as number) - 300) {
          try {
            const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.accessToken}`
              },
              body: JSON.stringify({ token: token.accessToken }),
            })
            
            if (refreshResponse.ok) {
              const refreshedData = await refreshResponse.json()
              const decodedToken = jwt.decode(refreshedData.token) as JwtPayload
              
              console.log("Token refreshed successfully")
              return {
                ...token,
                accessToken: refreshedData.token,
                exp: decodedToken?.exp,
              }
            } else {
              console.log("Token refresh failed, clearing token")
              return {
                ...token,
                accessToken: null,
              }
            }
          } catch (error) {
            console.error("Token refresh error:", error)
            return {
              ...token,
              accessToken: null,
            }
          }
        }
        
        // If token is already expired
        if (currentTime > (token.exp as number)) {
          console.log("Token expired, clearing accessToken")
          return {
            ...token,
            accessToken: null,
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
          exp: token.exp,
        }
      }

      return session
    },
  },

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