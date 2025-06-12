// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'ALLOWALL');
  response.headers.set('Content-Security-Policy', 'frame-ancestors *');
  return response;
}
