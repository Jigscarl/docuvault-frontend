import api from "./axios";

const activityApi = {
    getRecent:async (limit = 20) => {
        const response = await api.get("/activities", {params: {limit},});
        return response.data;
    },
    getSummary: async () => {
        const response = await api.get("/activities/summary");
        return response.data;
    },
};

export default activityApi;