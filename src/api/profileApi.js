import api from "./axios";

const profileApi = {
    getMyProfile: async () => {
        const response = await api.get("/profile/me");
        return response.data;
    },
    syncMyProfile: async (fullName) => {
        const response = await api.post("/profile/me", { fullName });
        return response.data;
    }
};

export default profileApi;