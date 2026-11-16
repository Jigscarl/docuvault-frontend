import {useEffect,useState} from "react";
import {X, Download,Loader2,FileText,AlertCircle} from "lucide-react";
import documentApi from "../../api/documentApi";
import {downloadFile} from "../../utlls/downloadFile";
export default function DocumentPreview({documnet,  onClose}){
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(()=>{
        let active = true;
        async  function loadPreview(){
            try{
                setLoading(true);
                setError("");
                const result = await documentApi.download(document.id);
                if(active){
                    setPreviewUrl(result.url);
                }
            }
            catch (err){
                if(active){
                    setError(err.response?.data?.message || "Unable to load document Preview.");
                }
            }
            finally {
                if(active) setLoading(false);
            }
        }
        loadPreview();
        return () =>{active = false}

    }, [document.id]);

    const isPdf = document.contentType === "application/pdf";
    const isImage = ["image/jpeg", "image/png"].includes(document.contentType);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-6">
            <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <div className="flex min-w-0 items-center gap-3">
                        <FileText className="shrink-0 text-indigo-600"/>
                        <div className="min-w-0">
                            <h2 className="truncate font-semibold text-gray-900 dark:text-white">{document.name}</h2>
                            <p className="text-xs text-gray-500">{document.category}</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-ceneter gap-2">
                        <button onClick = {()=> downloadFile(document.id,document.name)} className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700">
                            <Download size = {16}/>
                            <span className="hidden sm:inline">Download</span>
                        </button>
                        <button onClick={onClose} className = "rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label = "Close preview"><X size={20}/></button>
                    </div>
                </div>
                <div className="flex flex-1 items-center justify-center overflow-auto bg-gray-100 p-3 dark:bg-gray-950">
                    {loading && (
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                            <Loader2 className="animate-spin" size={32}/>
                             Loading preview...
                        </div>
                    )}
                    {!loading && error && (
                        <div className="flex flex-col items-center gap-3 text-center text-red-500">
                            <AlertCircle size={36}/>
                            <p>{error}</p>
                        </div>
                    )}
                    {!loading && !error && previewUrl && isImage && (
                        <img src={previewUrl} alt={document.name} className="max-h-full max-w-full rounded-lg object-contain"/>
                    )}
                    {!loading && !error && previewUrl && !isPdf && !isImage && (
                        <div className="text-center">
                            <FileText size={48} className="mx-auto mb-3 text-indigo-500"/>
                            <p className="font-medium text-gray-800 dark:text-white">Preview is not available for this file type</p>
                            <p className="mt-2 text-sm text-gray-500">Download the document to open it.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}