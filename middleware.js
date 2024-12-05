import { NextResponse } from 'next/server'

export function middleware(request){
    const path = request.nextUrl.pathname;

    const publicPath = path === '/login' || path === '/signup' || path === '/verifyemail' || path === '/';

    const token = request.cookies.get("token")?.value || "";

    if(publicPath && token){
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(!publicPath && !token){
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: [
      '/',
      '/login',
      '/signup',
      '/profile',
      '/verifyemail',
      '/tasks',
      '/dashboard',
    ]
  }