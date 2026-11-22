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

   upload: async(file, metadata = {}) =>{
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", metadata.Category || "Uncategorized");
      formData.append("description", metadata.description || "");

      if(metadata.folderId){
        formData.append("folderId", metadata.folderId);
      }
      const response = await api.post("/documents", formData);
      return response.data;
   },
    

    download: async(id) => {
        const response = await api.get(`/documents/${id}/download`);
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
    },

    getTrash: async ()=> {
        const response = await api.get("/documents/trash");
        return response.data;
    },

    permanentlyDelete: async(id) => {
        const response = await api.delete(`/documents/${id}/permanent`);
        return response.data;
    },

    moveToTrash: async (id) => {
        const response = await api.delete(`/documents/${id}`);
        return response.data;
    },

    moveToFolder: async (documentId, folderId) => {
        const response = await api.patch(`/documents/${documentId}/folder`, {folderId});
        return response.data;
    },


}

export default documentApi;