import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import{ArrowLeft, FileText,Search,FolderOpen,Download,Eye,FolderInput,Trash2, X} from "lucide-react";
import folderApi from "../../api/folderApi";
import documentApi from "../../api/documentApi";
import { downloadFile } from "../../utlls/downloadFile";
import DocumentPreview from "../../componets/dashboard/DocumentPreview";

export default function FolderDetails(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [folder, setFolder] = useState(null);
    const[documents, setDocuments] = useState([]);
    const [search, setSearch] =useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [previewDocument, setPreviewDocument] =useState(null);
    const [movingDocument, setMovingDocument] = useState(null);
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const loadFolder = useCallback(async () =>{
        try{
            setLoading(true);
            setError("");

            const  [folders, allDocuments] = await Promise.all([folderApi.getAll(), documentApi.getAll()]);
            setFolders(folders);
            const selectedFolder = folders.find(
                (items) => items.id == id
            );

            if(!selectedFolder){
                setError("Folder not found.");
                return;
            }
            setFolder(selectedFolder);
            setDocuments(
                allDocuments.filter((document) => document.folderId == id && !document.deletedAt)
            );
        }
        catch (err){
            console.error("Folder loading failed:", err);
            setError(err.response?.data?.message || "Unable to load this folder.");
        }
        finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadFolder();
    },[loadFolder]);

    const handleMove = async () => {
        if(!movingDocument) return;

        try {
            setActionLoading(true);
            await documentApi.moveToFolder(
                movingDocument.id,
                selectedFolderId || null
            );

            setMovingDocument(null);
            setSelectedFolderId("");

            await loadFolder();
        } catch (error){console.error("Move failed:", error);
            alert(error.response?.data?.message || "Unable to move document.");
        } finally {setActionLoading(false);}
        
    };

    const handleTrash = async (documentId) => {
        const confirmed = window.confirm("Are you sure you want to move this document to trash?");

        if(!confirmed) return;

        try{setActionLoading(true);
            await documentApi.moveToTrash(documentId);
            await loadFolder();
        } catch (error){
            console.error("Trash operation failed:", error);
            alert("Unable to move document to trash.");
        } finally{setActionLoading(false);}
    };

    const filteredDocuments = useMemo(() => {
        return documents.filter((document) => document.name.toLowerCase().includes(search.toLowerCase()));
    }, [documents, search]);

    if (loading){
        return (
            <div className="p-8">
                <p className="text-red-500">{error}</p>
                <button onClick={() => navigate("/folders")} className="mt-4 text-indigo-600">
                    Back to folders
                </button>
            </div>
        );
    }
    return (
        <div className="space-y-6 p-6">
            <button onClick={() =>navigate("/folders")} className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600">
                <ArrowLeft size={18}/>
                Back to folders
            </button>

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-3">
                        <FolderOpen size={30} className="text-indigo-600"/>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{folder.name}</h1>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">{documents.length} document(s) in this folder</p>
                </div>
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:w-72"/>
                </div>
            </div>

            {filteredDocuments.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                    <FileText size={40} className="mx-auto text-gray-400"/>
                    <h2 className="mt-4 font-semibold text-gray-800 dark:text-white">No documents found</h2>
                    <p className="mt-2 text-sm text-gray-500">Upload a document or move an existing document into this folder.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                            <tr>
                                <th className="p-4">Document</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Size</th>
                                <th className="p-4">Date added</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDocuments.map((document) => (
                                <tr key={document.id} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <FileText className="text-indigo-500" size={20}/>
                                            <span className="font-medium text-gray-800 dark:text-white">{document.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                       {document.category}
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {(document.sizeBytes /1024).toFixed(1)} KB 
                                    </td>
                                    <td className="p-4 text-gray-500">{new Date(document.createdAt).toLocaleDateString()}</td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setPreviewDocument(document)} title="Preview document" className="rounded-lg p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800">
                                                <Eye size={17}/>
                                            </button>
                                            <button onClick={() => downloadFile(document.id, document.name)} title="Download document" className="rounded-ld p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800">
                                                <Download size={17}/>
                                            </button>
                                            <button onClick={()=> {
                                                setMovingDocument(document);
                                                setSelectedFolderId(document.folderId || "");
                                            }} title="Move document" className="rounded-lg p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800">
                                                <FolderInput size={17}/>
                                            </button>
                                            <button onClick={() => handleTrash(document.id)} title="Move to trash" disabled={actionLoading} className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-gray-800">
                                                <Trash2 size={17}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {movingDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                  <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Move document
                      </h2>
                      <button onClick={() =>setMovingDocument(null)} disabled={actionLoading} className="text-gray-500">
                       <X size={20}/>
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                     Choose a destination folder for {movingDocument.name}
                    </p>
                    <select value={selectedFolderId} onChange={(e) => setSelectedFolderId(e.target.value)} className="mt-5 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                     <option value="">No folder (Unassigned)</option>
                     {folders.map((item) => (
                        <option key = {item.id} value={item.id}>{item.name}</option>
                     ))}
                    </select>

                    <div className="mt-6 flex justify-end gap-3">
                     <button onClick={handleMove} disabled={actionLoading} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white diasbled:opacity-50">
                     {actionLoading? "Moving..." : "Move"}
                     </button>
                    </div>
                  </div>
                </div>
            )}

            {previewDocument && (
                <DocumentPreview document={previewDocument} onClose={() => setPreviewDocument(null)}/>
            )}
        </div>

        
    )
    
}