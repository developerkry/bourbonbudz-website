import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory chat storage (in production, use Redis or a database)
const chatMessages: any[] = []
const MAX_MESSAGES = 100

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const streamId = searchParams.get('streamId') || 'after-dark'
  
  // Return recent messages for the stream
  const recentMessages = chatMessages
    .filter(msg => msg.streamId === streamId)
    .slice(-50) // Last 50 messages
  
  return NextResponse.json({ messages: recentMessages })
}

export async function POST(request: NextRequest) {
  try {
    const { streamId, message, user } = await request.json()
    
    if (!user || !message?.trim()) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const chatMessage = {
      id: Date.now().toString(),
      streamId: streamId || 'after-dark',
      user: {
        name: user.name,
        image: user.image
      },
      message: message.trim(),
      timestamp: new Date().toISOString()
    }

    // Add to messages array
    chatMessages.push(chatMessage)
    
    // Keep only recent messages
    if (chatMessages.length > MAX_MESSAGES) {
      chatMessages.splice(0, chatMessages.length - MAX_MESSAGES)
    }

    return NextResponse.json({ 
      success: true, 
      message: chatMessage 
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
