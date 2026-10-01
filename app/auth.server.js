import { createCookie } from "react-router"

export const authCookie = createCookie("auth", {
    secrets: [process.env.COOKIE_SECRET ?? "react-router-secret"],
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,      // 7 jours, en secondes
})
