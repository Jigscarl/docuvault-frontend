import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UploadCloud, FileText, FileImage, FileSpreadsheet, File, X, CheckCircle, AlertCircle, ArrowLeft} from "lucide-react";

const MAX_FILE_SIZE = 10*1024*1024;

const ALLOWED_TYPES =[
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png"
];

function getFileIcon(file){
    if (file.type.includes("pdf") || file.type.includes("word")){
        return FileText;
    }
    if(file.type.includes("image")){
        return FileImage;
    }
    if(file.type.includes("spreadsheet") || file.type.includes("excel")){
        return FileSpreadsheet;
    }
    return File;
}

function formatFileSize(bytes){
    if(bytes < 1024) return `${bytes} B`;
    if(bytes < 1024* 1024){ return `${(bytes/1024).toFixed(1)} KB`}
    return `${(bytes / (1024*1024)).toFixed(2)} MB`;
}

export default function UploadDocument(){
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [isDragging, setDragging] = useState(false);
    const [category, setCategory] = useState("General");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    
    const processFiles = (selectedFiles) => {
        setError("");
        const validFiles = [];
        const errors = [];
        for(const file of selectedFiles){
            if(!ALLOWED_TYPES.includes(file.type)){
                errors.push(`${file.name}: This file type is not supported.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE){
                errors.push(`${file.name}: Maximum file size is 10 MB.`);
                continue;
            }
            validFiles.push({
                id: `${file.name}-${file.size}-${file.lastModified}`, file, progress:0, status:"ready",
            });

        }
        if (errors.length > 0) setError(errors.join(" "));
        setFiles((current) => {
            const combined = [...current, ...validFiles];
            return combined.filter((item, index,array) => array.findIndex((other) => other.id === item.id) === index);
        });
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setDragging(false);
        processFiles(Array.from(event.dataTransfer.files));
    };
    const removeFile = (id) => {
        setFiles((current) => current.filter((item)=>item.id !== id));
    };
    const handleUpload = async (event) => {
        event.preventDefault();
        if (files.length===0){
            setError("Please select atleast one document.");
            return;
        }
        setError("");
        for (const selectedFile of files){
            for (let progress=0; progress <=100; progress+=10){
                await new Promise((resolve)=> setTimeout(resolve,100));
                setFiles((current)=> current.map((item)=>item.id === selectedFile.id ? {
                    ...item,progress,status: progress === 100 ? "completed" : "uploading",
                }
                : item
            ));
            }
        }
        alert("Demo upload completed");
        navigate("/documents");
    };
    return(
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <button onClick={()=> navigate("/documents")} className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600">
                    <ArrowLeft size={16}/>
                    Back to documents
                </button>
                <h1 className="text-3xl font-bold">Upload Documents</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Upload and Organise your files in Docuvault</p>
            </div>
            <form onSubmit = {handleUpload} className="space-y-6">
                <div onDragOver={(event) => {event.preventDefault();setDragging(true);}}
                onDragLeave={()=> setDragging(false)}
                onDrop={handleDrop} className={`rounded-2xl border-2 border-dashed p-10 text-center transition ${isDragging ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10" : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900"}`}>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                      <UploadCloud size={32}/>
                    </div>
                    <h2 className="mt-5 text-lg font-semibold">
                        Drag and drop your files here
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">Or click below to browse your computer</p>

                    <button type="button" onClick={()=> fileInputRef.current?.click()} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700">
                        Browse files
                    </button>
                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" className="hidden" onChange={(event) => {processFiles(Array.from(event.target.files || [])); event.target.value ="";}}/>
                    <p className="mt-4 text-xs text-slate-400">PDF, Word, Excel, JPG and PNG . Maximum 10 MB per file</p>
                </div>
                {error && (
                    <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        <AlertCircle size={18} className="mt-0.5 shrink-0"/>
                        {error}
                    </div>
                )}
                {files.length > 0 && (
                    <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="p-5 font-semibold">Selected files ({files.length})</h2>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {files.map((item) => {
                            const Icon = getFileIcon(item.file);
                            return (<div key={item.id} className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                                      <Icon size={22}/>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="break-all text-sm font-medium">{item.file.name}</p>
                                        <p className="mt-1 text-xs text-slate-500">{formatFileSize(item.file.size)}</p>
                                    </div>
                                    {item.status === "completed" ? (
                                        <CheckCircle className="text-emerald-500" size={20}/>
                                    ): (
                                        <button type="button" onClick={()=> removeFile(item.id)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" aria-label={`Remove ${item.file.name}`}>
                                            <X size={18}/>
                                        </button>
                                    )}
                                </div>
                                {item.status === "uploading" || item.status === "completed" ? (
                                    <div className="mt-4">
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div className="h-full rounded-full bg-indigo-600 transition-all" style={{width: `${item.progress}%`}}/>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500">{item.progress}% uploaded</p>
                                    </div>
                                ) : null}
                            </div>);
                        })}
                        </div>
                    </div>
                )}
                 <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                    <h2 className="mb-5 font-semibold">Document Details</h2>
                    <div>
                        <label className="mb-2 block text-sm font-medium">Category</label>
                        <select value={category} onChange={(event)=>setCategory(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none dark:border-slate-700 dark:bg-slate-800">
                            <option>General</option>
                            <option>Projects</option>
                            <option>Finance</option>
                            <option>Work</option>
                            <option>Personal</option>
                            <option>Images</option>
                        </select>
                    </div>
                    <div className="mt-5">
                        <label className="mb-2 block text-sm font-medium">Description (optional)</label>
                        <textarea value={description} onChange={(event)=> setDescription(event.target.value)} rows={3} maxLength={500} placeholder="Add a description for your documents..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"/>
                    </div>
                 </div>
                 <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <button type="button" onClick={()=> navigate("/documents")} className="rounded-xl border border-slate-200 px-5 py-3 font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Cancel</button>
                    <button type="submit" disabled={files.length === 0} className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                        Upload {files.length > 0 ? `${files.length} file(s)` : "documents"}
                    </button>
                 </div>
            </form>
        </div>
    );
}