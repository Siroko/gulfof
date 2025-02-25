import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { name } = await request.json()
  const timestamp = Date.now()
  
  await kv.lpush('gulf-names', { name, timestamp })
  
  return NextResponse.json({ success: true })
}

export async function GET() {
  const names = await kv.lrange('gulf-names', 0, -1)
  return NextResponse.json(names)
} 