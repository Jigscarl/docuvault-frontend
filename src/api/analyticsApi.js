import api from "./axios";

const analyticsApi = {
    getDashboard: async () => {
        const response = await api.get("/analytics/dashboard");
        return response.data;
    },
};

export default analyticsApi;