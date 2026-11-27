import api from "./axios";

const userApi = {
    getAll : async () =>{
        const response = await api.get("/users");
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    updateStatus: async (id, isActive) => {
        const response = await api.patch(`/users/${id}/status`, {isActive});
        return response.data;
    },

    updateRole: async (id, role) => {
        const response = await api.patch(`/users/${id}/role`, {role});
        return response.data;
    }
};

export default userApi;