import { NextResponse } from 'next/server'

const BACKEND_BASE = process.env.NEXT_PUBLIC_BE

export async function PUT(request: Request, { params }: { params: Promise<{ nodeId: string }> }) {
  const resolvedParams = await params
  const body = await request.json()
  const res = await fetch(`${BACKEND_BASE}/${resolvedParams.nodeId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ message: text || 'Failed to update node' }, { status: res.status })
  }
  const data = await res.json()
  return NextResponse.json(data)
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ nodeId: string }> }) {
  const resolvedParams = await params
  const res = await fetch(`${BACKEND_BASE}/${resolvedParams.nodeId}`, {
    method: 'DELETE'
  })
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ message: text || 'Failed to delete node' }, { status: res.status })
  }
  const data = await res.json()
  return NextResponse.json(data)
}


