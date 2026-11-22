import axios from "axios";
import { supabase } from "../lib/supabase";
import { promise } from "zod";

const api = axios.create({
    baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5251/api",

    headers:{
        Accept: "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const {data: {session}, error} = await supabase.auth.getSession();

        if(error){
            throw error;
        }

        if(session?.access_token){
            config.headers.Authorization = 'Bearer ${session.access_token}';
        }
        return config;
    },
    (error) => promise.reject(error)
);

export default api;