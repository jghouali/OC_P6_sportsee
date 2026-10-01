const isMockData = false

const BASE_URL = isMockData ? './mock' : 'http://localhost:8000/api'

export const APIService = {
    getLogin: async (username, password) => {
        let endPoint
        let headers

        if (!username || !password) {
            throw new Error('Invalid credentials')
        }

        if (password.length <= 8) {
            throw new Error('Password must have 8 char min.')
        }

        // Si on arrive ici, ça signifie qu'aucun return ci-dessus n'a été exécuté
        // Ça veut donc dire qu'on peut faire un fetch 
        if (isMockData) {
            if (username != "MOCKsophiemartin" || password != "password123") {
                throw new Error('Invalid credentials')
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

        try {
            const response = await fetch(endPoint, headers)

            if (!response.ok) {
                throw new Error('Error, failed to fetch')
            }

            if (!response.headers.get('content-type').includes('application/json')) {
                throw new Error('Not a json response')
            }

            // Si on arrive ici, c'est que tout s'est bien passé, on peut récupérer l'utilisateur et le renvoyer
            const datas = await response.json() // Renvoi directement les données retournées par la réponse
            return datas
        } catch (err) {
            throw err
        }
    },

    getUserInfo: async (token) => {
        let endPoint
        let headers
        if (isMockData) {
            if (!token) {
                throw new Error('Authentication required')
            }

            if (token !== 'jwt-token') {
                throw new Error('Invalid token')
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

        try {
            const response = await fetch(endPoint, headers)

            if (!response.ok) {
                throw new Error('Error, failed to fetch')
            }

            if (!response.headers.get('content-type').includes('application/json')) {
                throw new Error('Not a json response')
            }

            // Si on arrive ici, c'est que tout s'est bien passé, on peut récupérer l'utilisateur et le renvoyer
            const datas = await response.json() // Renvoi directement les données retournées par la réponse
            return datas

        } catch (err) {
            throw err
        }
    },

    getActivityInfos: async (token, startWeek, endWeek) => {
        let endPoint
        let headers

        if (isMockData) {
            if (!token) {
                throw new Error('Authentication required')
            }

            if (token !== 'jwt-token') {
                throw new Error('Invalid token')
            }
            endPoint = `${BASE_URL}/activityInfos.json`
            headers = {}
        } else {
            // fetch sur backend
            endPoint = `${BASE_URL}/user-activity?startWeek=${startWeek}&endWeek=${endWeek}`
            headers = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                method: "GET"
            }
        }

        try {
            const response = await fetch(endPoint, headers)

            if (!response.ok) {
                throw new Error('Error, failed to fetch')
            }

            if (!response.headers.get('content-type').includes('application/json')) {
                throw new Error('Not a json response')
            }

            // Si on arrive ici, c'est que tout s'est bien passé, on peut récupérer l'utilisateur et le renvoyer
            const datas = await response.json() // Renvoi directement les données retournées par la réponse

            if (isMockData) {
                const startDate = new Date(startWeek);
                const endDate = new Date(endWeek);
                const now = new Date();

                return datas.filter(data => {
                    const date = new Date(data.date);
                    date.setHours(0, 0, 0, 0);

                    return (
                        date >= startDate &&
                        date <= endDate &&
                        date <= now
                    );
                });
            }
            return datas

        } catch (err) {
            throw err
        }
    }
}