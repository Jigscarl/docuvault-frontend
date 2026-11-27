import api from "./axios";

const adminDashboardApi = {
    getStats: async () => {
        const response = await api.get("/admindashboard/stats");
        return response.data;
    },

    getDocumentActivity: async (days = 7) => {
        const response = await api.get(`/admindashboard/document-activity?days=${days}`);

        return response.data
    },

    getRecentActivity: async (limit = 10) => {
        const response = await api.get(`/admindashboard/recent-activity?limit=${limit}`)
        return response.data;
    }
};

export default adminDashboardApi;