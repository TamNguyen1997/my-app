import { NextResponse, NextRequest } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
    destination: string
    permanent: boolean
}


export function middleware(request: NextRequest) {
    try {
        const pathname = request.nextUrl.pathname
        if (!pathname) {
            return NextResponse.next()
        }
        const redirect = (redirects as Record<string, RedirectEntry>)[pathname]
        if (!redirect) {
            return NextResponse.next()
        }

        const statusCode = redirect.permanent ? 308 : 307
        const url = request.nextUrl.clone()
        url.pathname = redirect.destination
        return NextResponse.redirect(url, statusCode)
    } catch (error) {
        console.error(error)
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/:path*',
}