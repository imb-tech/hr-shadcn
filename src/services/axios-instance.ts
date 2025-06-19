import { REFRESH_TOKEN } from "@/constants/api-endpoints"
import { USER_ACCESS_KEY, USER_REFRESH_KEY } from "@/constants/localstorage-keys"
import { getAccessToken, getRefreshToken } from "@/lib/get-token"
import { setAccessToken } from "@/lib/set-token"
import { QueryClient } from "@tanstack/react-query"
import axios from "axios"

const baseURL = import.meta.env.VITE_DEFAULT_URL

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
})

export function setupAxiosInterceptors(queryClient: QueryClient) {
    axiosInstance.interceptors.request.use(
        function (config) {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        function (error) {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        function (response) {
            return response;
        },
        async function (error) {
            const originalRequest = error.config;
            const status = error.response?.status;
            const isLoginPage = window.location.pathname === "/auth";

            // Agar request yo'q bo'lsa yoki status yo'q bo'lsa, reject
            if (!originalRequest || !status) {
                return Promise.reject(error);
            }

            // 🔁 Refresh token orqali qayta urinish
            if (status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const refresh = getRefreshToken();
                    if (refresh) {
                        const refreshResponse = await axios.post(
                            `${baseURL}${REFRESH_TOKEN}/`,
                            { refresh }
                        );
                        const access: string = refreshResponse?.data?.access;
                        if (access) {
                            setAccessToken(access);
                            originalRequest.headers.Authorization = `Bearer ${access}`;
                            return axiosInstance(originalRequest); // 🔁 retry
                        }
                    }
                    if (!isLoginPage) {
                        location.href = "/auth";
                    }
                } catch (refreshError) {
                    localStorage.removeItem(USER_ACCESS_KEY);
                    localStorage.removeItem(USER_REFRESH_KEY);
                    if (!isLoginPage) {
                        location.href = "/auth";
                    }
                    return Promise.reject(refreshError);
                }
            }

            //  403 bo‘lsa GET_ME ni yangilab qayta urinish
            if (status === 403 && !originalRequest._403retry) {
                originalRequest._403retry = true;
                // await queryClient.invalidateQueries({ queryKey: [GET_ME] });
                await new Promise((resolve) => setTimeout(resolve, 100));
                return axiosInstance(originalRequest);
            }

            return Promise.reject(error);
        }
    );
}

export default axiosInstance;
