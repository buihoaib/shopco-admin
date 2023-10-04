export { default } from "next-auth/middleware"

export const config = { matcher: ["/unknown/:path*"] } //"/protected/:path*"