import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const SEED_PATH = path.join(process.cwd(), 'prisma', 'seed.json')

export async function GET() {
  try {
    const raw = fs.readFileSync(SEED_PATH, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({ events: [], articles: [], partners: [] })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json()
    fs.writeFileSync(SEED_PATH, JSON.stringify(data, null, 2), 'utf-8')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
