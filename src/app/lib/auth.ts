import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google/YouTube OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile https://www.googleapis.com/auth/youtube.readonly'
        }
      }
    }),
    
    // Facebook OAuth
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    
    // TikTok OAuth (using generic OAuth provider)
    {
      id: 'tiktok',
      name: 'TikTok',
      type: 'oauth',
      authorization: {
        url: 'https://www.tiktok.com/auth/authorize/',
        params: {
          client_key: process.env.TIKTOK_CLIENT_KEY,
          scope: 'user.info.basic',
          response_type: 'code',
        },
      },
      token: 'https://open-api.tiktok.com/oauth/access_token/',
      userinfo: 'https://open-api.tiktok.com/oauth/userinfo/',
      clientId: process.env.TIKTOK_CLIENT_KEY!,
      clientSecret: process.env.TIKTOK_CLIENT_SECRET!,
      profile(profile: any) {
        return {
          id: profile.data.user.open_id,
          name: profile.data.user.display_name,
          image: profile.data.user.avatar_url,
          email: null, // TikTok doesn't provide email
        }
      },
    },
    
    // Email/Password Authentication
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.hashedPassword) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id
        session.user.isSubscribed = token.isSubscribed
        session.user.subscriptionTier = token.subscriptionTier
      }
      return session
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        
        // Check subscription status
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { subscription: true }
        })
        
        token.isSubscribed = !!dbUser?.subscription?.active
        token.subscriptionTier = dbUser?.subscription?.tier || null
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt' as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
