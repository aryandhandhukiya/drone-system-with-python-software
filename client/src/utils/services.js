import axios from 'axios'

export const baseUrl = 'http://localhost:4000'

export const socketUrl = 'https://9186-202-134-156-97.ngrok-free.app'

export const postReq = async (url, userData) => {
    const response = await axios.post(url, userData, {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
        },
    })

    if (response.data?.error) {
        return { error: true, data: response.data }
    }
    else {
        return { error: false, data: response.data }
    }
}

export const getReq = async (url) => {
    const response = await axios.get(url)
    if (response.data.error) {
        let message = "An error occured"
        return { error: "true", message }
    }
    return response.data

}