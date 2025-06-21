import { GET_ME, REFRESH_TOKEN } from "@/constants/api-endpoints"
import { USER_ACCESS_KEY, USER_REFRESH_KEY } from "@/constants/localstorage-keys"
import { getAccessToken, getRefreshToken } from "@/lib/get-token"
import { setAccessToken } from "@/lib/set-token"
import { QueryClient } from "@tanstack/react-query"
import axios from "axios"

const baseURL = import.meta.env.VITE_DEFAULT_URL
const partURL = import.meta.env.VITE_DEFAULT_PART_URL
// const baseURL = "https://location.imbtech.uz/api/v1/"

const url = import.meta.env.DEV ? "demo.imbtech.uz" : window.location.hostname
// const url = 'demo.imbtech.uz'
const baseURLOrigin = 'https://' + url.split('.')[0] + partURL
// const baseURLOrigin = "http://192.168.1.122/api/v1"


const axiosInstance = axios.create({
    baseURL: baseURLOrigin,
    headers: {
        "Content-Type": "application/json",
    },
    formSerializer: {
        indexes: null,
    },
    paramsSerializer: {
        indexes: null,
    },
})

export function setupAxiosInterceptors(queryClient: QueryClient) {
    // Add a request interceptor
    axiosInstance.interceptors.request.use(
        function (config) {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        function (error) {
            return Promise.reject(error)
        },
    )

    // Add a response interceptor
    axiosInstance.interceptors.response.use(
        function (response) {
            return response
        },
        async function (error) {
            const originalRequest = error.config
            const status = error.response?.status
            const isLoginPage = window.location.pathname === '/login';

            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true
                try {
                    const refresh = getRefreshToken()
                    if (refresh) {
                        const refreshResponse = await axios.post(
                            baseURL + "/" + REFRESH_TOKEN + "/",
                            {
                                refresh,
                            },
                        )
                        const access: string = refreshResponse?.data?.access
                        if (access) {
                            setAccessToken(access)
                            originalRequest.headers.Authorization = `Bearer ${access}`
                            return axiosInstance(originalRequest)
                        }
                    }
                    if (!isLoginPage) {
                        location.href = "/login"
                    }

                } catch (refreshError) {
                    localStorage.removeItem(USER_ACCESS_KEY)
                    localStorage.removeItem(USER_REFRESH_KEY)
                    if (!isLoginPage) {
                        location.href = '/login';
                    }
                    return Promise.reject(refreshError)
                }
            }

            if (status === 403) {
                if (originalRequest._403retry) {
                    originalRequest._403retry = true
                    // Invalidate and wait for refetch to complete
                    await queryClient.invalidateQueries({
                        queryKey: [GET_ME],
                    })

                    // Wait a small delay to ensure the query is refetched
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    return axiosInstance(originalRequest)
                }
            }
            return Promise.reject(error)
        },
    )
}

export default axiosInstance
