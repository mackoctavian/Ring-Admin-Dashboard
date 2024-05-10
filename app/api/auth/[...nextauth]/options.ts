import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
          }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
              username: { label: "Username", type: "text", placeholder: "Enter your username or email address" },
              password: { label: "Password", type: "password", placeholder: "Enter your password" }
            },
            async authorize(credentials, req) {
              // Retrieve user data from db
              const user = { id: "1", name: "Peter Karanja", username: "pkaranja", email: "pkaranja@gmail.com", password: "itchydix" }
        
              if ( ( credentials?.username === user.username || credentials?.username === user.email )
                 && credentials?.password === user.password ){
                return user
              }else{
                return null
              }
            }
          })
    ],
    pages: {}
}