import {createContext, useCallback, useContext,useEffect, useState} from "react";

import documentApi from "../api/documentApi";
import { useAuth } from "./AuthContext";

const DocumentContext = createContext(null);

export function DocumentProvider({children}){
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const[error, setError] = useState("");
    const {user, loading: authLoading} = useAuth();

    const fetchDocuments = useCallback(async () => {
        try{
            setLoading(true);
            setError("");
            
            const data = await documentApi.getAll();

            setDocuments(data);
        } catch(err){
            console.error("Fetching documents failed:" , err);
            setError(
                err.response?.data?.message ||
                (err.request
                    ? "Could not reach the documents API. Start the backend or set VITE_API_BASE_URL to its reachable URL."
                    : err.message || "Unable to load your documents.")
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if(!authLoading && user) void Promise.resolve().then(fetchDocuments);
    }, [authLoading, user, fetchDocuments]);

    const visibleDocuments = user ? documents : [];
    const value = {
        documents: visibleDocuments,
        favorites: visibleDocuments.filter((document) => document.isFavorite),
        trash: visibleDocuments.filter((document) => document.deletedAt),
        loading: authLoading || (user ? loading : false),
        error: user ? error : "",
        fetchDocuments,
        setDocuments,
        toggleFavorite: async (id) => {
            await documentApi.toggleFavorite(id);
            await fetchDocuments();
        },
        moveToTrash: async (id) => {
            await documentApi.delete(id);
            await fetchDocuments();
        },
        restoreDocument: async (id) => {
            await documentApi.restore(id);
            await fetchDocuments();
        },
    };

    return (
        <DocumentContext.Provider value = {value}>{children}</DocumentContext.Provider>
    );
}

export function useDocuments(){
    const context = useContext(DocumentContext);

    if(!context){
        throw new Error("useDocuments must be used inside DocumentProvider");
    }

    return  context;
}