import { NextResponse } from 'next/server'
import { TESTFLIGHT_URL } from '@/lib/constants'
export function GET() {
  return NextResponse.redirect(TESTFLIGHT_URL, 302)
}
