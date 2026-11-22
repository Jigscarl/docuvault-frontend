import {useState, useEffect} from "react";
import { Search,Upload,FileText,FileSpreadsheet,FileImage,File,Star,Trash2,Grid,List,Download,Eye, FolderInput, Info, X ,Calender,FolderOpen,HardDrive,Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../../context/DocumentContext";
import { downloadFile } from "../../utlls/downloadFile";
import DocumentPreview from "../../componets/dashboard/DocumentPreview";
import documentApi from "../../api/documentApi";
import folderApi from "../../api/folderApi";

function getFileIcon(type){
    switch (type) {
        case "pdf":
            return <FileText className="text-red-500" size={22}/>;
        case "excel":
            return <FileSpreadsheet className="text-green-500" size={22}/>;
        case "word":
            return <FileText className="text-blue-500" size={22}/>;
        case "image":
            return <FileImage className="text-purple-500" size={22}/>;
        default:
            return <File size={22}/>;        
    } 
}

export default function Documents(){
    const navigate = useNavigate();
    const {
        documents,
        loading,
        error,
        fetchDocuments,
        moveToTrash,
    } =useDocuments();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [view, setView] = useState("list");
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [folders, setFolders] = useState([]);
    const [movingDocument, setMovingDocument] = useState(null);
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [moving, setMoving] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [bulkFolderId, setBulkFolderId] = useState("");
    const [bulkLoading, setBulkLoading] = useState(false);
    const [detailsDocument, setDetailsDocument] = useState(null);

    const toggleDocumentSelection = (documentId) => {
        setSelectedDocuments((current) => current.includes(documentId)
            ? current.filter((id) => id !== documentId)
            : [...current, documentId]);
    };

    const toggleSelectAll = () => {
        const currentPageIds = paginatedDocuments.map((document) => document.id);

        const allSelected = currentPageIds.every((id) => selectedDocuments.includes(id));
        if(allSelected){
            setSelectedDocuments((current) => current.filter((id) => !currentPageIds.includes(id)));
        } else {
            setSelectedDocuments((current) => [...new Set([...current, ...currentPageIds])]);
        }
    };

    const clearSelection = () =>{
        setSelectedDocuments([]);
    };


    useEffect(()=> {
        const loadFolders = async () => {
            try{
                const data = await folderApi.getAll();
                setFolders(data);
            } catch (error){
                console.error("Failed to load folders:", error);
            }
        };
        loadFolders();
    }, []);

    const filteredDocuments = documents.filter((document) => {
        const matchesSearch = document.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || document.category === category;
        const matchesFolder = selectedFolder === "all"
            ? true
            : selectedFolder === "unassigned"
                ? !document.folderId
                : document.folderId === selectedFolder;

        return matchesSearch && matchesCategory && matchesFolder;
    });

    const sortedDocuments = [...filteredDocuments].sort((a,b)=>{
        switch (sortBy){
            case "name-asc":
                return a.name.localeCompare(b.name);
            case "name-desc":
                return b.name.localeCompare(a.name);
            case "oldest":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "largest":
                return b.sizeBytes - a.sizeBytes;
            case "smallest":
                return a.sizeBytes - b.sizeBytes;
            case "newest":
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);                   
        }
    })

    const totalDocuments = sortedDocuments.length;
    const totalPages = Math.ceil(totalDocuments/itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedDocuments = sortedDocuments.slice(startIndex, startIndex + itemsPerPage);

    const handleMoveDocument = async () => {
        if (!movingDocument) return;

        try{
            setMoving(true);

            await documentApi.moveToFolder(
                movingDocument.id,
                selectedFolderId || null
            );

            await fetchDocuments();
            setMovingDocument(null);
            setSelectedFolderId("");

            alert ("Document moved successfully.")
        } catch (error){
            console.error("Move failed:", error);

            alert(
                error.response?.data?.message || "Unable to move document."
            );
        } finally {
            setMoving(false);
        }
    };

    

    const handleToggleFavorite = async (document) =>{
        try{
            await documentApi.toggleFavorite(document.id);
            await fetchDocuments();
        } catch (error) {
            console.error("Favorite update failed:", error);

            alert("Unable to update favorite status.");
        }
    };

    const handleBulkMove = async () => {
        if(!selectedDocuments.length || !bulkFolderId) return;

        try{
            setBulkLoading(true);
            const destinationFolder = bulkFolderId === "unassigned" ? null : bulkFolderId;
            await Promise.all(selectedDocuments.map((id) => documentApi.moveToFolder(id, destinationFolder)));
            await fetchDocuments();
            setSelectedDocuments([]);
            setBulkFolderId("");

            alert("Selected documents moved successfully.");

        } catch (error){
            console.error("Bulk move failed:", error);
            alert("Some documents could not be moved. Refresh the page to check their current location.");
            await fetchDocuments();
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkTrash = async () => {
        if (!selectedDocuments.length) return;

        const confirmed = window.confirm(`Move ${selectedDocuments.length} selected documents to trash?`);
        if(!confirmed) return;
        try {
            setBulkLoading(true);
            await Promise.all(selectedDocuments.map((id)=> documentApi.moveToTrash(id)));
            await fetchDocuments();
            setSelectedDocuments([]);
            alert("Selected documents moved to trash."); 
        } catch (error) {
            console.error("Bulk trash failed:", error);
            alert("Some documents could not be moved to trash. Refresh the page to check their status.");
            await fetchDocuments();
        } finally {
            setBulkLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Documents</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage and Organize your documents.</p>
                </div>
                <button onClick={() => navigate("/upload")} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                    <Upload size={18}/>
                    Upload Document
                </button>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                    <input type="text" value={search} onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }} placeholder="Search documents..." className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                </div>
                <div className="flex items-center gap-3">
                    <select value={category} onChange={(e) => {
                        setCategory(e.target.value);
                        setCurrentPage(1);
                    }} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <option value="All">All categories</option>
                        <option value="Projects">Projects</option>
                        <option value="Finance">Finance</option>
                        <option value="Work">Work</option>
                        <option value="Images">Images</option>
                    </select>
                    <select value={selectedFolder} onChange={(e) => {
                        setSelectedFolder(e.target.value);
                        setCurrentPage(1);
                    }} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                        <option value="all">All folders</option>
                        <option value="unassigned">Unassigned</option>
                        {folders.map((folder) => (
                            <option key={folder.id} value={folder.id}>{folder.name}</option>
                        ))}
                    </select>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-500 dark:text-gray-400">Sort:</label>
                        <select value ={sortBy} onChange={(e)=> {
                            setSortBy(e.target.value);
                            setCurrentPage(1);
                        }} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value= "largest">Largest first</option>
                            <option value="smallest">Smallest first</option>

                        </select>
                    </div>
                    <button onClick={() => setView("list")} className={`rounded-lg p-2 ${view === "list" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="List view">
                        <List size={19}/>
                    </button>
                    <button onClick={() => setView("grid")} className={`rounded-lg p-2 ${ view === "grid" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="Grid view">
                        <Grid size={19}/>
                    </button>
            </div>
        </div>

        {!loading && !error && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{filteredDocuments.length} documents found</p>
        )}

        {loading ? (
            <p className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                Loading documents...
            </p>
        ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                <button onClick={fetchDocuments} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                    Retry
                </button>
            </div>
        ) : filteredDocuments.length > 0 ? (
            view === "list" ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    {selectedDocuments.length > 0 && (
                        <div className="flex flex-col gap-3 rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-950/30 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-semibold text-indigo-900 dark:text-indigo-300">
                                    {selectedDocuments.length} documents selected
                                </p>
                                <button onClick={clearSelection} className="mt-1 text-xs text-indigo-600 hover:underline dark:text-indigo-400">
                                    Clear selection
                                </button>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <select value={bulkFolderId} onChange={(e) => setBulkFolderId(e.target.value)} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                                    <option value="">Choose destination</option>
                                    <option value="unassigned">Unassigned</option>
                                    {folders.map((folder) => (
                                        <option key={folder.id} value={folder.id}>{folder.name}</option>
                                    ))}
                                </select>
                                <button onClick={handleBulkMove} disabled={!bulkFolderId || bulkLoading} className="rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white disabled:opacity-50">
                                    Move selected
                                </button>
                                <button onClick={handleBulkTrash} disabled={bulkLoading} className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white disabled:opacity-50">
                                    Move to Trash
                                </button>
                            </div>
                        </div>
                    )}
                    <table className="w-full min-w-[650px] text-left">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                            <tr>
                                <th className="p-4">
                                    <input type="checkbox" checked={paginatedDocuments.length > 0 && paginatedDocuments.every((document) => selectedDocuments.includes(document.id))} onChange={toggleSelectAll} className="h-4 w-4 rounded border-gray-300 text-indigo-600"/>
                                </th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Document</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Category</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Size</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Modified</th>
                                <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedDocuments.map((document)=> (
                                <tr key={document.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                                    <td className="p-4">
                                        <input type="checkbox" checked={selectedDocuments.includes(document.id)} onChange={() => toggleDocumentSelection(document.id)} className="h-4 w-4 rounded border-gray-300 text-indigo-600"/>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(document.type)}
                                            <span className="text-sm font-medium text-gray-900 dark:text-white">{document.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {document.category}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {document.size}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                                        {document.modified}
                                    </td>
                                    <td  className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => downloadFile(document.id, document.name)} title="Download" className="rounded-lg p-2 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950">
                                                <Download size={17} />
                                            </button>
                                            <button onClick={()=> setSelectedDocument(document)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800">
                                                <Eye size={17}/>
                                            </button>
                                            <button onClick={() => handleToggleFavorite(document)} title="Toggle favorite" className={`rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${document.isFavorite ? "text-amber-500" : "text-gray-400"}`}>
                                                <Star size={17} fill={document.isFavorite ? "currentColor" : "none"}/>
                                            </button>
                                            <button onClick={() => setDetailsDocument(document)} title="Document Details" className="rounded-lg p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800">
                                                <Info size={17}/>
                                            </button>
                                            <button onClick={() => {setMovingDocument(document); setSelectedFolderId(document.folderId || "");}} className="rounded-lg p-2 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-800" title="Move to folder">
                                                <FolderInput size={18}/>
                                            </button>
                                            <button onClick={()=> {
                                                if(window.confirm(`Move "${document.name}" to Trash?`)) {moveToTrash(document.id)}
                                            }} title="Move to trash" className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                                                <Trash2 size={17}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Rows per page
                            </span>
                            <select value={itemsPerPage} onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }} className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {totalDocuments === 0 ? "Showing 0 documents" : `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, totalDocuments)} of ${totalDocuments} documents`}
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={()=> setCurrentPage((page) => Math.max(1, page -1 ))} disabled={currentPage === 1} className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-white">
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                                Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                            </span>
                            <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage >= totalPages} className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-white">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredDocuments.map((document) => (
                        <div key={document.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                {getFileIcon(document.type)}
                                <button onClick={() => handleToggleFavorite(document)} className={document.isFavorite ? "text-amber-500" : "text-gray-400"}>
                                    <Star size={18} fill={document.isFavorite ? "currentColor" : "none"}/>
                                </button>
                            </div>
                            <h3 className="mt-4 font-medium text-gray-900 dark:text-white">{document.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{document.category} . {document.size}</p>

                            <div className="mt-4 flex items-center justify-between">
                                <button onClick={() => setSelectedDocument(document)} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400">
                                    <Eye size={16}/>
                                    Preview
                                </button>
                                <button onClick={()=> moveToTrash(document.id)} className="flex items-center gap-2 text-sm text-red-600">
                                    <Trash2 size={15}/>
                                    Move to trash
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )) :(
                <div className="rounded-xl border border-dashed border-gray-300 py-16 text-center dark:border-gray-700">
                    <FileText size={40} className="mx-auto text-gray-400"/>
                    <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">No documents found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or Catedory
                    </p>
                </div>
        )}
        {selectedDocument && (
            <DocumentPreview
                key={selectedDocument.id}
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
            />
        )}

        {movingDocument && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Move document</h2>
                    <p className="mt-2 text-sm text-gray-500">Select a destination for {movingDocument.name}</p>

                    <select value={selectedFolderId} onChange={(e) => setSelectedFolderId(e.target.value)} className="mt-5 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <option value="">No folder (Unassigned)</option>
                        {folders.map((folder) =>(
                            <option key={folder.id} value = {folder.id}>{folder.name}</option>
                        ))}
                    </select>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={() => setMovingDocument(null)} disabled={moving} className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-700 dark:text-white">
                            Cancel
                        </button>
                        <button onClick={handleMoveDocument} disabled={moving} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50">
                            {moving ? "Moving..." : "Move document"}
                        </button>
                    </div>
                </div>
            </div>
        )}
        {detailsDocument &&(
            <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
                <div className="h-full w-full max-w-md overflow-y-auto bd-white shadow-xl dark:bg-gray-950">
                    <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Document details</h2>
                        <button onClick={()=>setDetailsDocument(null)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                            <X size={20}/>
                        </button>
                    </div>
                    <div className="space-y-6 p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-indigo-100 p-4 dark:bg-indigo-950">
                                <FileText size={30} className="text-indigo-600"/>
                            </div>
                            <div className="min-w-0">
                                <h3 className="break-words font-semibold text-gray-900 dark:text-white">{detailsDocument.name}</h3>
                                <p className="mt-1 text-sm text-gray-500">{detailsDocument.category}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Description</h3>
                            <p className="mt-2 text-sm text-sm text-gray-500">
                                {detailsDocument.description || "No description provided."}
                            </p>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                                File information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm text-gray-500">
                                        <FileText size={17}/>
                                        file type
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {detailsDocument.contentType || "unknown"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm text-gray-500">
                                        <HardDrive size={17}/>
                                        File size
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {(detailsDocument.sizeBytes / 1024).toFixed(2)} KB 
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                   <span className="flex items-center gap-2 text-sm text-gray-500">
                                    <Calender size={17}/>
                                    Uploaded
                                   </span>
                                   <span className="text-sm text-gray-900 dark:text-white">
                                    {new Date(detailsDocument.createdAt).toLocaleDateString()}
                                   </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm text-gray-500">
                                        <Clock size={17}/>
                                        Last Modified
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {detailsDocument.updatedAt ? new Date(detailsDocument.updatedAt).toLocaleDateString() : "Not available"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm text-gray-500">
                                        <FolderOpen size={17}/>
                                        Folder
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {folders.find(
                                            (folder) => folder.id === detailsDocument.folderId
                                        )?.name || "Unassigned"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm text-gray-500">
                                        <Star size={17}/>
                                        Favorite
                                    </span>
                                    <span className="text-sm text-gray-900 dark:text-white">
                                        {detailsDocument.isFavorite ? "Yes" : "No"}
                                    </span>
                                </div>

                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-5 dark:border-gray-800">
                            <button onClick={()=>{
                                setPreviewDocument(detailsDocument);
                                setDetailsDocument(null);
                            }} className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700">
                                Preview document
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
}
