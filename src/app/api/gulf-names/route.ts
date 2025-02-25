import { promises as fs } from 'fs'
import { NextResponse } from 'next/server'
import path from 'path'

interface GulfName {
  name: string
  timestamp: number
}

const dataFile = path.join(process.cwd(), 'data', 'gulf-names.json')

async function readNames(): Promise<GulfName[]> {
  try {
    const data = await fs.readFile(dataFile, 'utf8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

export async function POST(request: Request) {
  const { name } = await request.json()
  const timestamp = Date.now()
  
  const existingNames = await readNames()
  const updatedNames = [{ name, timestamp }, ...existingNames].slice(0, 10)
  
  await fs.mkdir(path.dirname(dataFile), { recursive: true })
  await fs.writeFile(dataFile, JSON.stringify(updatedNames))
  
  return NextResponse.json({ success: true })
}

export async function GET() {
  const names = await readNames()
  return NextResponse.json(names)
} 