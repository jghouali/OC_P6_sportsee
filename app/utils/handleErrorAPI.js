export function handleErrorAPI(err, setData, setLoading, submit) {
    if (err.status === 401 || err.status === 403) {
        setData({ "message": "Veuillez vous re-authentifier" })
        submit(null, { method: "post", action: "/logout" })
    } else {
        setData({ "message": "Serveur indisponible, veuillez réessayer plus tard" })
    }
    setLoading(false)
}