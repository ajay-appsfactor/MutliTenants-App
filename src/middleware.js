import { NextResponse } from 'next/server'
import { rootDomain } from '@/lib/utils'

// Utility to extract subdomain
function extractSubdomain(request) {
  const url = request.url
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0] // Remove port if any

  // Local development (e.g., ajay.localhost:3000)
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const match = hostname.match(/^(.+)\.localhost$/)
    return match ? match[1] : null
  }

  // Vercel preview deployment: tenant---branch.vercel.app
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('---')
    return parts.length > 0 ? parts[0] : null
  }

  // Production (e.g., ajay.yourdomain.com)
  const rootDomainFormatted = rootDomain.split(':')[0]

  const isSubdomain =
    hostname !== rootDomainFormatted &&
    hostname !== `www.${rootDomainFormatted}` &&
    hostname.endsWith(`.${rootDomainFormatted}`)

  return isSubdomain
    ? hostname.replace(`.${rootDomainFormatted}`, '')
    : null
}

// Main middleware function
export function middleware(request) {
  const { pathname } = request.nextUrl
  const subdomain = extractSubdomain(request)

  if (subdomain) {
    // Block /admin access on subdomains
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Rewrite / to subdomain landing route
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/s/${subdomain}`, request.url))
    }
  }

  return NextResponse.next()
}

// Only match non-static, non-API paths
export const config = {
  matcher: [
    '/((?!api|_next|[\\w-]+\\.\\w+).*)',
  ],
}
