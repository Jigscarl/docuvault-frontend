import { Upload } from "lucide-react";
import api from "./axios";
const documentApi = {
    getAll: async()=> {
        const response = await api.get("/documents");
        return response.data;
    },
    
    getById: async(id) => {

        const response = await api.get(`/documents/${id}`);
        return response.data;
    },

    Upload: async (File,metadata = {}) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", metadata.category || "Uncategorized");

        formData.append("description", metadata.description || "");
        const response = await api.post("/documents", formData);
        return response.data;
    },

    delete: async(id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },
    restore: async(id) => {
        const response = await api.patch(`/documents/${id}/restore`);
        return response.data;
    },

    toggleFavorite: async(id) => {
        const response = await api.patch(`/documents/${id}/favorite`);
        return response.data;
    }
}

export default documentApi;