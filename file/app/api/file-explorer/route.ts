import { NextResponse } from 'next/server'

const BACKEND_BASE = process.env.NEXT_PUBLIC_BE

export async function GET() {
  if (!BACKEND_BASE) {
    return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 })
  }
  const res = await fetch(BACKEND_BASE, { cache: 'no-store' })
  if (!res.ok) {
    return NextResponse.json({ message: 'Failed to fetch tree' }, { status: res.status })
  }
  const data = await res.json()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!BACKEND_BASE) {
    return NextResponse.json({ message: 'Backend URL not configured' }, { status: 500 })
  }
  const body = await request.json()
  const res = await fetch(`${BACKEND_BASE}/insert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ message: text || 'Failed to insert node' }, { status: res.status })
  }
  const data = await res.json()
  return NextResponse.json(data)
}


