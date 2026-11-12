import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {UploadCloud,FileText,FileSpreadsheet,FileImage,X,ArrowLeft, CheckCircle} from "lucide-react";
import {useDocuments} from "../../context/DocumentContext";

export default function UploadDocument(){
    const navigate = useNavigate();
    const {addDocuments} = useDocuments();
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState("");
    const [category, setCategory] = useState("Uncategorized");
    const [description,setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const MAX_SIZE = 10 * 1024 * 1024;

    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "image/jpeg",
        "image/png",
    ];

    function handleFiles(selectedFiles){
        setError("");
        const validFiles = [];
        for (const file of Array.from(selectedFiles)){
            if(!allowedTypes.includes(file.type)){
                setError(`${file.name} has an unsupported file format.`);
                continue;
            }
            if(file.size > MAX_SIZE){
                setError(`${file.name} exceeds the 10 MB limit.`);
                continue;
            }
            validFiles.push(file)
        }
        setFiles((current) => {
            const combined = [...current];

            validFiles.forEach((file)=>{
                const alreadyAdded = combined.some((existing)=> existing.name === file.name && existing.size === file.size);
                if(!alreadyAdded){
                    combined.push(file)
                }
            });
            return combined;
        });
    }

    function removeFile(index){
        setFiles((current) => current.filter((_, fileIndex)=> fileIndex !== index));
    }

    function formatSize(bytes){
        return bytes < 1024 * 1024 ? `${(bytes/1024).toFixed(1)} KB` : `${(bytes/ (1024 * 1024)).toFixed(2)} MB`
    }

    function getFileIcon(file){
        if(file.type === "application/pdf"){
            return <FileText className="text-red-500" size={24}/>;
        }
        if(file.type.includes("spreadsheet") || file.type.includes("excel")){
            return <FileSpreadsheet className="text-green-600" size={24}/>
        }
        if(file.type.startsWith("image/")){
            return <FileImage className="text-purple-500" size={24}/>
        }
        return <FileText className="text-blue-500" size={24}/>
    }

    function handleUpload(){
        if(files.length === 0){
            setError("Please select at least one document.");
            return;
        }
        setUploading(true);
        setError("");

        addDocuments(files, {category,description});

        setUploading(false);
        navigate("/documents");
    }

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate("/documents")} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ArrowLeft size={20}/>
                </button>
                <div >
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Documents</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Add new documents to your Docuvault workspace</p>
                </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => {event.preventDefault(); handleFiles(event.dataTransfer.files);}} onClick={() =>fileInputRef.current.click()}
                className="cursor-pointer rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 px-6 py-12 text-center transition hover:border-indigo-500 dark:border-indigo-700 dark:bg-indigo-950/20">
                    <UploadCloud size={45} className="mx-auto mb-4 text-indigo-600"/>
                    <h3 className="font-semibold text-gray-800 dark:text-white">Drag and drop files here</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Or click to browse files from your device</p>
                    <p className="mt-3 text-xs text-gray-400">PDF, Word, Excel, JPG and PNG . Maximum 10 MB per file</p>
                    <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" className="hidden" onChange={(event)=>{
                        handleFiles(event.target.files); event.target.value = "";
                    }}/>
                </div>
                {error && (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/30">{error}</p>
                )}
                {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <h3 className="font-semibold text-gray-800 dark:text-white">Selected files({files.length})</h3>
                        {files.map((file, index) => (
                            <div key={`${file.name}-${file.size}-${index}`} className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                                <div className="flex min-w-0 items-center gap-3">
                                    {getFileIcon(file)}
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-800 dark:text-white">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                                    </div>
                                </div>
                                <button onClick={()=> removeFile(index)} className="ml-3 text-gray-400 hover:text-red-500" title="Remove file">
                                    <X size={19}/>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                <h3 className="mb-5 font-semibold text-gray-800 dark:text-white">Document information</h3>
                <div className="space-y-4">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select value={category} onChange={(event) => setCategory(event.target.value)} className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                            <option value="Uncategorized">Uncategorized</option>
                            <option value="Projects">Projects</option>
                            <option value="Finance">Finance</option>
                            <option value="Work">Work</option>
                            <option value="Personal">Personal</option>
                            <option value="Academic">Academic</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} placeholder="Enter a short description of these documents..." 
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                <button onClick={()=> navigate("/documents")} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
                    Cancel
                </button>
                <button onClick={handleUpload} disabled={uploading || files.length === 0} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                    <CheckCircle size={18}/>
                    {uploading ? "Uploading..." : `Add ${files.length} Document(s)`}
                </button>
            </div>
        </div>
    )
}