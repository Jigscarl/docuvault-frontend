import { useState } from "react";
import { Search, Star, FileText, FileSpreadsheet,FileImage,File,MoreVertical,Download,Trash2 } from "lucide-react";

const initialFavorites = [
    {
        id:1,
        name: "Project Proposal.pdf",
        type: "excel",
        category: "Projects",
        size: "2.4 MB",
        modified: "Today",
    },
    {
        id:2,
        name: "Financial Report.xlsx",
        type: "pdf",
        category:"Finance",
        size: "1.8 MB",
        modified:"Yesterday"
    },
    {
        id:3,
        name: "Company Profile.docx",
        type: "word",
        category: "Work",
        size: "850 KB",
        modified: "2 days ago"
    },
    {
        id:4,
        name: "Office Image.png",
        type: "image",
        category:"Images",
        size: "3.2 MB",
        modified: "Last Week"
    }
];

function getFileIcon(type){
    switch (type){
        case "pdf":
            return <FileText className="text-red-500" size={22}/>;
        case "excel":
            return <FileSpreadsheet className="text-green-500" size={22}/>;
        case "word":
            return <FileText className="text-blue-500" size={22}/>;
        case "image":
            return <FileImage className="text-purple-500" size={22}/>;
        default:
            return <File size={22}/>            

    }
}

export default function Favorities(){
    const [favorities, setFavorites] = useState(initialFavorites);
    const [search, setSearch] = useState("");
    const [menuDocument, setMenuDocument] = useState(null);
    const filteredFavorities = favorities.filter((document) => document.name.toLowerCase().includes(search.toLowerCase()));

    function removeFavorite(document){
        const confirmed = window.confirm(`Remove "${document.name}" from favorites?`);
        if(confirmed){
            setFavorites((current) => current.filter((item) => item.id !== document.id));
        }
        setMenuDocument(null);
    }

    function downloadDocument(document){
        alert (`Download functionality for ${document.name} will be connected to backend.`)
    }
    return (
        <div className="space-y-6">
            <div>
                <div className="flex items-center gap-2">
                    <Star className="text-amber-500" size={25}/>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Favorites</h1>
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Quickly access your important documents</p>
            </div>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="relative max-w-md flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search favorities..." className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-800 ">
                    {favorities.length} favorite documents
                </span>
            </div>
            <div className="overflow-visible rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                {filteredFavorities.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Document</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Category</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Size</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Modified</th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFavorities.map((document) => (
                                    <tr key={document.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                {getFileIcon(document.type)}
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{document.name}</p>
                                                    <p className="text-xs text-gray-500">{document.type.toUpperCase()} document</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{document.category}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{document.size}</td>
                                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{document.modified}</td>
                                        <td className="relative px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => downloadDocument(document)} title="Download" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-700">
                                                    <Download size ={17}/>
                                                </button>
                                                <button onClick={() => setMenuDocument(menuDocument === document.id ? null : document.id)} title="More Options" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <MoreVertical size={17}/>
                                                </button>
                                            </div>
                                            {menuDocument === document.id && (
                                            <div className="absolute right-8 top-12 z-10 w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                                                <button onClick={() => removeFavorite(document)} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                                                    <Trash2 size={15}/>
                                                    Remove from favorites
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
                        <Star size={40} className="mx-auto text-gray-300"/>
                        <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">No favorite document found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try another search or add documents to your favorites</p>
                    </div>
                )}
            </div>
        </div>
    );
}