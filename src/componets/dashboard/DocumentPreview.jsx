import { useEffect, useState } from "react";
import {X, Download, Loader2, FileText} from "lucide-react";
import documentApi from "../../api/documentApi";
import {downloadFile} from "../../utlls/downloadFile";

export default function DocumentPreview({document, onClose}){
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadPreview(){
            try{
                setLoading(true);
                setError("");

                const result = await documentApi.download(document.id);
                if(!result.url){
                    throw new Error("Preview URL unavailable.");
                }
                if(active){
                    setPreviewUrl(result.url);
                }
            } catch (err){
                console.error("Loading document preview failed:", err);
                if(active){
                    setError("Unable to load this document.");
                }
            }
            finally{
                if(active) setLoading(false);
            }
        }

        loadPreview();
        return ()=>{
            active = false;
            active = false;
        };
    }, [document.id]);

    const contentType = (document.contentType || "").toLowerCase();
    const isPdf = contentType === "application/pdf";
    const isImage = contentType.startsWith("image/");

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <FileText className="text-indigo-600"/>
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white">{document.name}</h2>
                            <p className="text-xs text-gray-500">Document preview</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => downloadFile(document.id, document.name)} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white">
                            <Download size={16}/>
                        </button>
                        <button onClick={onClose} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <X size={20}/>
                        </button>
                    </div>
                </div>

                <div className="flex min-h-[400px] flex-1 items-center justify-center overflow-auto bg-gray-100 dark:bg-gray-950">
                    {loading && (
                        <Loader2 className="animate-spin text-indigo-600" size={32}/>
                    )}
                    {error && (
                        <p className="text-red-500">{error}</p>
                    )}
                    {!loading && !error && previewUrl && isPdf && (
                        <iframe src={previewUrl} title={document.name} className="h-[70vh] w-full"/>
                    )}
                    {!loading && !error && previewUrl && isImage && (
                        <img src={previewUrl} alt={document.name} className="max-h-[70vh] max-w-full object-contain"/>
                    )}

                    {!loading && !error && !isPdf && !isImage && (
                        <div className="p-8 text-center">
                            <FileText size={48} className="mx-auto mb-4 text-indigo-500"/>
                            <p className="font-medium text-gray-800 dark:text-white">Preview not supported for this file type</p>
                            <p className="mt-2 text-sm text-gray-500">Download the document to open it</p>
                        </div>
                    )}
            </div>
            </div>
        </div>
    );
}