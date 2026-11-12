import {useState} from "react";
import { Search,Upload,FileText,FileSpreadsheet,FileImage,File,Star,Trash2,Grid,List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDocuments } from "../../context/DocumentContext";

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
        toggleFavorite,
        moveToTrash,
    } =useDocuments();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [view, setView] = useState("list");

    const filteredDocuments = documents.filter((document) => {
        const matchesSearch = document.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === "All" || document.category === category;
        return matchesSearch && matchesCategory;
    });

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
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..." className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"/>
                </div>
                <div className="flex items-center gap-3">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                        <option value="All">All categories</option>
                        <option value="Projects">Projects</option>
                        <option value="Finance">Finance</option>
                        <option value="Work">Work</option>
                        <option value="Images">Images</option>
                    </select>
                    <button onClick={() => setView("list")} className={`rounded-lg p-2 ${view === "list" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="List view">
                        <List size={19}/>
                    </button>
                    <button onClick={() => setView("grid")} className={`rounded-lg p-2 ${ view === "grid" ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950" : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"}`} title="Grid view">
                        <Grid size={19}/>
                    </button>
            </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">{filteredDocuments.length} documents found</p>

        {filteredDocuments.length > 0 ? (
            view === "list" ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
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
                            {filteredDocuments.map((document)=> (
                                <tr key={document.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900">
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
                                            <button onClick={() => toggleFavorite(document.id)} title="Toggle favorite" className={`rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700 ${document.isFavorite ? "text-amber-500" : "text-gray-400"}`}>
                                                <Star size={17} fill={document.isFavorite ? "currentColor" : "none"}/>
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
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredDocuments.map((document) => (
                        <div key={document.id} className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                {getFileIcon(document.type)}
                                <button onClick={() => toggleFavorite(document.id)} className={document.isFavorite ? "text-amber-500" : "text-gray-400"}>
                                    <Star size={18} fill={document.isFavorite ? "currentColor" : "none"}/>
                                </button>
                            </div>
                            <h3 className="mt-4 font-medium text-gray-900 dark:text-white">{document.name}</h3>
                            <p className="mt-1 text-sm text-gray-500">{document.category} . {document.size}</p>

                            <button onClick={()=> moveToTrash(document.id)} className="mt-4 flex items-center gap-2 text-sm text-red-600">
                                <Trash2 size={15}/>
                                Move to trash
                            </button>
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
        </div>
    );
}
