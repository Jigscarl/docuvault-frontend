import api from "./axios";

const folderApi = {
    getAll: async () => {
        const response = await api.get("/folders");
        return response.data;
    },
    create: async (name) =>{
        const response = await api.post("/folders", {name,});
        return response.data;
    },
    rename: async (id, name) => {
        const response = await api.put(`/folders/${id}`, {name});
        return response.data
    },

    delete: async (id) => {
        const response = await api.delete(`/folder/${id}`);
        return response.data
    },
};
export default folderApi;