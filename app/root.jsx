import {
  isRouteErrorResponse,
  Form,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import NotFound from './routes/NotFound.jsx'

import AuthProvider from "./context/AuthProvider/AuthProvider.jsx";
import { authCookie } from "./auth.server";
import { APIService } from "./services/APIService";
import "./app.css";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }) {
  return (
    <html lang="fr">
      <head>
        <title>Sportsee</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-[#F2F3FF]">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { userInfo } = useLoaderData()
  return (
    <AuthProvider userInfo={userInfo}>
      <Outlet />
    </AuthProvider>
  );
}

export async function loader({ request }) {
  const token = await authCookie.parse(request.headers.get("Cookie"))
  if (!token) {
    return { userInfo: null }
  }

  try {
    const { password: _, ...userInfo } = await APIService.getUserInfo(token)
    return { userInfo: { ...userInfo, token } }
  } catch (err) {
    if (err.status === 401 || err.status === 403) {
      throw redirect("/login", {
        headers: { "Set-Cookie": await authCookie.serialize("", { maxAge: 0 }) },
      })
    }
    throw err
  }
}

export function ErrorBoundary({ error }) {
  let message = "Oups !";
  let details = "Une erreur est survenue.";
  let stack;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFound />
    }
    message = "Erreur";
    details = error.statusText || details;
  } else if (error instanceof Error) {
    if (!error.status) details = "Serveur injoignable, réessayez plus tard."
    else if (import.meta.env.DEV) details = error.message
    if (import.meta.env.DEV) stack = error.stack
  }

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center gap-6 text-center py-16 px-8 m-auto ">
      <h1 className='text-9xl m-0 text-bluePrimary font-black'>{message}🙈</h1>
      <p className="text-left">{details}</p>
      {stack && (
        <pre className="w-full bodyDefault p-4 overflow-x-auto text-left">
          <code>{stack}</code>
        </pre>
      )}
      <Form method="post" action="/logout">
        <button className='inline-block py-3 px-12 bg-bluePrimary text-white rounded-lg font-extrabold transition-all duration-200 ease-in w-60' type="submit">Retour à la connexion</button>
      </Form>
    </div>
  );
}
