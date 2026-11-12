import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {Star, Search,FileText,FileSpreadsheet,FileImage,Download,FolderOpen} from "lucide-react";
import {useDocuments} from "../../context/DocumentContext";

export default function Favorites(){
    const {favorites, toggleFavorite} =useDocuments();
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const filteredFavorities = favorites.filter((document) => document.name.toLowerCase().includes(searchTerm.toLowerCase()));

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorite Documents</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Quickly access your most important documents.</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-md">
                    <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                    <input type="text" placeholder="Search favorities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {favorites.length} favorite documents
                </div>
            </div>
            {filteredFavorities.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 dark:bg-gray-700/50 dark:text-gray-300">
                              <tr>
                                <th className="px-6 py-4 font-medium">Document</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Size</th>
                                <th className="px-6 py-4 font-medium">Modified</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredFavorities.map((document) => (
                                    <tr key={document.id}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(document.type)}
                                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                                    {document.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-3">
                                                <button onClick={() => alert("Download functionality comming soon")} title="Download" className="text-gray-400 hover:text-indigo-600">
                                                    <Download size={18}/>
                                                </button>
                                                <button onClick={()=> toggleFavorite(document.id)} title="Remove from favorites" className="text-yellow-500 hover:text-red-500">
                                                    <Star size={18}/>
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
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                        {searchTerm ? "No matching favorites" : "No favorite document yet"}
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {searchTerm ? "Try searching with a different name." : "Star a document to see it here."}
                    </p>
                    <button onClick={() => navigate("/documents")} className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                        Browse Documents
                    </button>
                </div>
            )}
        </div>
    )
}