const isMockData = import.meta.env.VITE_USE_MOCK === 'true'
const BASE_URL = import.meta.env.VITE_API_URL

function toISODate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')   // les mois commencent à 0
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function apiError(message, status) {
    const error = new Error(message)
    error.status = status
    return error
}

export const APIService = {
    getLogin: async (username, password) => {
        let endPoint
        let headers

        if (!username || !password) {
            throw apiError('Identifiants manquants', 401)
        }

        if (isMockData) {
            if (username != "MOCKsophiemartin" || password != "password123") {
                throw apiError('Identifiant invalide', 401)
            }

            endPoint = `${BASE_URL}/login.json`
            headers = {}

        } else {
            endPoint = `${BASE_URL}/login`
            headers = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ username: username, password: password })
            }
        }

        const response = await fetch(endPoint, headers)

        if (!response.ok) {
            if (response.status === 404) {
                throw apiError(`endpoint non disponible (404)`, 404)
            }
            throw apiError(`Erreur API (${response.status})`, response.status)
        }

        if (!response.headers.get('content-type')?.includes('application/json')) {
            throw apiError('Erreur API 500', 500)
        }

        // Si on arrive ici, c'est que tout s'est bien passé, on peut récupérer l'utilisateur et le renvoyer
        const datas = await response.json() // Renvoi directement les données retournées par la réponse
        return datas
    },

    getUserInfo: async (token) => {
        let endPoint
        let headers
        if (isMockData) {
            if (!token) {
                throw apiError('Aucun token valide trouvé', 401)
            }

            if (token !== 'jwt-token') {
                throw apiError('Token invalide', 401)
            }

            endPoint = `${BASE_URL}/userInfo.json`
            headers = {}
        } else {
            // fetch sur backend

            endPoint = `${BASE_URL}/user-info`
            headers = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: "GET"
            }
        }

        const response = await fetch(endPoint, headers)

        if (!response.ok) {
            if (response.status === 404) {
                throw apiError(`endpoint non disponible (404)`, 404)
            }
            throw apiError(`Erreur API (${response.status})`, response.status)
        }

        if (!response.headers.get('content-type')?.includes('application/json')) {
            throw apiError('Erreur API 500', 500)
        }

        // Si on arrive ici, c'est que tout s'est bien passé, on peut récupérer l'utilisateur et le renvoyer
        const datas = await response.json() // Renvoi directement les données retournées par la réponse
        return datas
    },

    getActivityInfos: async (token, startWeek, endWeek) => {
        let endPoint
        let headers

        if (isMockData) {
            if (!token) {
                throw apiError('Aucun token valide trouvé', 401)
            }

            if (token !== 'jwt-token') {
                throw apiError('Token invalide', 401)
            }

            endPoint = `${BASE_URL}/activityInfos.json`
            headers = {}
        } else {
            // fetch sur backend
            endPoint = `${BASE_URL}/user-activity?startWeek=${toISODate(startWeek)}&endWeek=${toISODate(endWeek)}`
            headers = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: "GET"
            }
        }

        const response = await fetch(endPoint, headers)

        if (!response.ok) {
            if (response.status === 404) {
                throw apiError(`endpoint non disponible (404)`, 404)
            }
            throw apiError(`Erreur API (${response.status})`, response.status)
        }

        if (!response.headers.get('content-type')?.includes('application/json')) {
            throw apiError('Erreur API 500', 500)
        }

        // Si on arrive ici, c'est que tout s'est bien passé, on peut récupérer l'utilisateur et le renvoyer
        const datas = await response.json() // Renvoi directement les données retournées par la réponse

        if (isMockData) {
            const startDate = new Date(startWeek);
            const endDate = new Date(endWeek);
            const now = new Date();

            return datas.filter(data => {
                const date = new Date(data.date + "T00:00");
                date.setHours(0, 0, 0, 0);

                return (
                    date >= startDate &&
                    date <= endDate &&
                    date <= now
                );
            });
        }
        return datas
    }
}