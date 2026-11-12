import {createContext, useContext, useState} from "react";

const DocumentContext = createContext(null);

const initialDocument = [
    {
        id: 1,
        name: "Project Propoasal.pdf",
        type:"pdf",
        category: "Projects",
        size: "2.4 MB",
        modified: "Today",
        isFavorite: true,
        deletedAt: null,
    },
    {
        id:2,
        name: "Financial Report.xlsx",
        type: "excel",
        category: "Finance",
        size: "1.8 MB",
        modified: "Yesterday",
        isFavorite: false,
        deletedAt: null,
    },
    {
        id: 3,
        name: "Company profile.docx",
        type: "Word",
        category: "Work",
        size: "850 KB",
        modified: "2 days ago",
        isFavorite: true,
        deletedAt: null,
    },
    {
        id: 4,
        name: "Old Budget.xlsx",
        type: "excel",
        category: "Finance",
        size: "1.2 MB",
        modified: "Last week",
        isFavorite: false,
        deletedAt: new Date().toISOString(),

    },

   ];

    export function DocumentProvider({children}){
        const [documents, setDocuments] = useState(initialDocument);

        function addDocuments(files, metadata = {}){
            const newDocuments = files.map((file) => ({
                id: Date.now() + Math.random(),
                name:file.name,
                type: getFileType(file),
                category: metadata.category || "Uncategorised",
                size: formatFileSize(file.size),
                modified: "just now",
                description:metadata.description || "",
                isFavorite: false,
                deletedAt: null,
                file,

            }));
            setDocuments((current) => [
                ...newDocuments,
                ...current,
            ]);
        }

        function toggleFavorite(id){
            setDocuments((current) => current.map((document) => document.id === id ? {
                ...document,
                isFavorite: !document.isFavorite,
            }
        : document
         ));
        }

        function moveToTrash(id){
            setDocuments((current) => current.map((document) => document.id === id ? {
                ...document,
                deletedAt: new Date().toISOString(),
            } : document));
        }

        function restoreDocument(id){
            setDocuments((current) => current.map((document) => document.id === id ? {
                ...document,
                deletedAt: null,
            } : document));
        }

        function permanentlyDelete(id){
            setDocuments((current) => current.filter((document) => document.id !== id));
        }

        function emptyTrash(){
            setDocuments((current) => current.filter((document) => !document.deletedAt))
        }

        const activeDocuments = documents.filter((document) => !document.deletedAt);
        const favoriteDocuments = activeDocuments.filter((document) => document.isFavorite);
        const trashedDocuments = documents.filter((document)=> document.deletedAt);

        const value = {
            documents: activeDocuments,
            favorites: favoriteDocuments,
            trash: trashedDocuments,
            addDocuments,
            toggleFavorite,
            moveToTrash,
            restoreDocument,
            permanentlyDelete,
            emptyTrash,
        };

        return (
            <DocumentContext.Provider value={value}>
                {children}
            </DocumentContext.Provider>
        );

        }

        // This context hook intentionally shares the provider module.
        // eslint-disable-next-line react-refresh/only-export-components
        export function useDocuments(){
            const context = useContext(DocumentContext);
            if (!context){
                throw new Error("useDocuments must be used inside DocumentProvider")
            }
            return context;
        }

        function getFileType(file){
            if (file.type === "application/pdf") return "pdf";

            if(
                file.type.includes("spreadsheet") || file.type.includes("excel")
            ){
                return "excel";
            }

            if(file.type.includes("word") || file.type.includes("document")){
                return "word";
            }

            if (file.type.startsWith("image/")) return "image";

            return "file";
        }

        function formatFileSize(bytes){
            if (bytes < 1024) return `${bytes} B`;
            if(bytes < 1024 * 1024){
                return `${(bytes/1024).toFixed(1)} KB`;
            }

            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }