import {useState} from "react";
import { Trash2,RotateCcw,Search,FileText,FileSpreadsheet,FileImage,AlertTriangle,FolderOpen } from "lucide-react";
import {useDocuments} from "../../context/DocumentContext"

export default function Trash(){
    const {trash, restoreDocument,permanentlyDelete,emptyTrash} = useDocuments();
    const [searchTerm, setSearchTerm] = useState("");
    const filteredTrash = trash.filter((document) => document.name.toLowerCase().includes(searchTerm.toLowerCase()));

    function getFileIcon(type){
        switch(type){
            case "pdf":
                return <FileText className="text-red-500" size={22}/>
            case "excel":
                return <FileSpreadsheet className="text-green-600" size={22}/>
            case "image":
                return <FileImage className="text-purple-500" size={22}/>
            default:
                return <FileText className="text-blue-500" size={22}/>            
        }
    }
    function handleEmptyTrash(){
        if(trash.length === 0 ) return;
        const confirmed = window.confirm("Are you sure you want to parmanently delete all documents in Trash?");
        if(confirmed){
            emptyTrash();
        }
    }

    function handlePermanentDelete(id){
        const confirmed = window.confirm("Permanently delete this document?");
        if (confirmed){
            permanentlyDelete(id);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trash</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage deleted documents and restore them when needed</p>
                </div>
                <button onClick={handleEmptyTrash} disabled={trash.length === 0} className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50">
                    <Trash2 size={17}/>
                    Empty Trash
                </button>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Search deleted documents.." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {trash.length} deleted document(s)
                </p>
            </div>
            {filteredTrash.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-300">
                               <tr>
                                <th className="px-6 py-4 font-medium">Document</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Size</th>
                                <th className="px-6 py-4 font-medium">Deleted On</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredTrash.map((document) => (
                                    <tr key={document.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(document.type)}
                                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                                    {document.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{document.name}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{document.category}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{document.size}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{document.deletedAt ? new Date(document.deletedAt).toLocaleDateString() : "Unknown"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={()=> restoreDocument(document.id)} title="Restore document" className="text-green-600 transition hover:text-green-700">
                                                    <RotateCcw size={18}/>
                                                </button>
                                                <button onClick={()=>handlePermanentDelete(document.id)} title="Delete permanently" className="text-red-500 transition hover:text-red-700">
                                                    <Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800">
                    <FolderOpen size={42} className="mx-auto mb-4 text-gray-400"/>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{searchTerm ? "No matching documents" : "Your Trash is empty"}</h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{searchTerm ? "Try searching with another document name." : "Documents you delete will appear here"}</p>
                </div>
            )}
            {trash.length > 0 && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                    <AlertTriangle size="20" className="mt-0.5 shrink-0 text-amber-600"/>
                    <p className="text-sm text-amber-800 dark:text-amber-300">Parmanently deleted documents cannot be recovered.</p>
                </div>
            )}
        </div>
    );
}