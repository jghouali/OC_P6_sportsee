import { redirect } from "react-router"
import { authCookie } from "../auth.server"

export async function action() {
    return redirect("/login", {
        headers: { "Set-Cookie": await authCookie.serialize("", { maxAge: 0 }) },
    })
}

export function loader() {
    return redirect("/dashboard")
}
