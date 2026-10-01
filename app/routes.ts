import {
    type RouteConfig,
    route,
    index
} from "@react-router/dev/routes";

export default [
    // /
    index("routes/index.jsx"),

    // Route publique
    route("login", "routes/login.jsx"),

    // Routes protégées
    route("", "routes/protected-layout.jsx", [
        route("dashboard", "routes/dashboard.jsx"),
        route("profile", "routes/profile.jsx"),
        route("logout", "routes/logout.jsx"),
    ]),
] satisfies RouteConfig;