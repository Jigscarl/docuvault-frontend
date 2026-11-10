import {useState} from "react";
import { Search,Trash2,FileText,FileSpreadsheet,FileImage,File,RotateCcw,MoreVertical,X } from "lucide-react";

const initialTrash = [
    {
        id:1,
        name: "Old Project Proposal.pdf",
        type: "pdf",
        category: "Projects",
        Size: "2.4 MB",
        deleted:"Today"
    },
    {
        id:2,
        name:"Budget 2025.xlsx",
        type: "excel",
        category: "Finance",
        size: "1.8 MB",
        deleted: "Yesterday"
    },
    {
        id:3,
        name:"Meeting Notes.docx",
        type: "word",
        category:"Work",
        size: "850 KB",
        deleted: "3 days ago"
    },


];

function getFileIcon(type){
    switch(type){
        case "pdf":
            return <FileText className="text-red-500" size={22}/>;
        case "excel":
            return <FileSpreadsheet className="text-green-500" size={22}/>;
        case "word":
            return <FileText className="text-blue-500" size={22}/>
        case "image":
            return <FileImage className="text-purple-500" size={22}/>
        default:
            return <File size={22} />               
    }
}

export default function Trash(){
    const [trash, setTrash] = useState(initialTrash);
    const [search, setSearch] = useState("");
    const [menuDocument, setMenuDocument] = useState(null);
    const filteredTrash = trash.filter((document) => 
    document.name.toLowerCase().includes(search.toLowerCase()));

    function restoreDocument(document){
        setTrash((current) =>
        current.filter((item) => item.id !== document.id));
        alert('${document.name} has been restored.')
    }
    function permanentlyDelete(document){
        const confirmed = window.confirm('Permanently delete "${document.name}" ? This cannot be undone.');
        if(confirmed){
            setTrash((current) => current.filter((item) =>item.id !== document.id));
        }
        setMenuDocument(null);
    }

    function emptyTrash(){
        if (trash.length === 0) return;
        const confirmed = window.confirm(
            "Permanently delete all documents in the trash? This cannot be undone."
        );
        if (confirmed){
            setTrash([])
        }
    }
    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <Trash2 className="text-red-500" size={25}/>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trash</h1>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Restore deleted documents or permanently remove them
                    </p>
                </div>
                <button onClick={emptyTrash} disabled={trash.length === 0} className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed diasbled-opacity-50 dark:border-red-900 dark:hover:bg-red-950">
                    <Trash2 size={17}/>
                    Empty Trash
                </button>
            </div>
            <div  className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
               <Trash2 size={20} className="mt-0.5 text-amber-600"/>
               <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300"> Documents in the trash </p>
                <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                    Permanently deleted documents cannot be recovered
                </p>
               </div>
            </div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="relative max-w-md flex-1">
                    <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search deleted documents..." className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{trash.length} deleted documents</span>
            </div>
            <div className="overflow-x-visible rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                {filteredTrash.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px] text-left">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Document</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Category</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Size</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Deleted</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrash.map((document) => (
                                    <tr key={document.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(document.type)}

                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{document.name}</p>
                                                    <p className="text-xs text-gray-500">{document.type.toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{document.category}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{document.size}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{document.deleted}</td>
                                        <td className="relative px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => restoreDocument(document)} title="Restore document" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-green-600 dark:hover:bg-gray-700">
                                                    <RotateCcw size={17}/>
                                                </button>
                                                <button onClick={() => setMenuDocument(
                                                    menuDocument === document.id ? null : document.id
                                                )} title="More Options" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <MoreVertical size={17}/>
                                                </button>
                                            </div>

                                            {menuDocument === document.id && (
                                                <div className="absolute right-8 top-12 z-10 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                                    <button onClick={() => permanentlyDelete(document)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                                                        <X size={15}/>\Delete permanently
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-16 text-center">
                        <Trash2 size={40} className="mx-auto text-gray-300"/>
                        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                            {search ? "No documents found" : "Your trash is empty"}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {search ? "Try searching for another document." : "Deleted documents will appear here."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

