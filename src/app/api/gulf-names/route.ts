import { NextResponse } from 'next/server'
import { Octokit } from '@octokit/rest'

interface GulfName {
  name: string
  timestamp: number
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

const owner = process.env.GITHUB_OWNER!
const repo = process.env.GITHUB_REPO!
const path = 'data/gulf-names.json'

export async function POST(request: Request) {
  const { name } = await request.json()
  const timestamp = Date.now()

  try {
    // Get current file content
    let existingNames: GulfName[] = []
    let fileSha = ''
    
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
      })
      
      if ('content' in data && !Array.isArray(data)) {
        const content = Buffer.from(data.content, 'base64').toString()
        existingNames = JSON.parse(content)
        fileSha = data.sha
      }
    } catch (error) {
      // File doesn't exist yet, use empty array
    }

    // Check if name already exists
    const nameExists = existingNames.some(entry => entry.name === name)
    if (!nameExists) {
      existingNames.unshift({ name, timestamp })
      // Keep only the last 10 unique names
      existingNames = existingNames.slice(0, 10)
    }

    // Update file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Add Gulf name: ${name}`,
      content: Buffer.from(JSON.stringify(existingNames, null, 2)).toString('base64'),
      ...(fileSha ? { sha: fileSha } : {})
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to save name' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    })

    if ('content' in data && !Array.isArray(data)) {
      const content = Buffer.from(data.content, 'base64').toString()
      return NextResponse.json(JSON.parse(content))
    }
    return NextResponse.json([])
  } catch (error) {
    return NextResponse.json([])
  }
} 