import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Просто пробуємо отримати список таблиць (або будь-яких даних)
    const result = await prisma.$queryRaw`SELECT NOW();`
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}