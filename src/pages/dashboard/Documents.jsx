import {useMemo, useState} from "react";
import { Search,Upload,Grid2X2,List,FileText,FileImage,FileSpreadsheet,File,Download,Trash2,Eye,Filter, } from "lucide-react";
import { useNavigate } from "react-router-dom";

const sampleDocuments = [
    {
        id:1,
        name:"Project proposal.pdf",
        category:"Projects",
        type:"PDF",
        size:"2.2MB",
        date:"3rd Nov 2026"
    },
    {
        id:2,
        name:"Financial Report.xlsx",
        category:"Finance",
        type:"Excel",
        size:"1.7MB",
        date:"1st Nov 2026",

    },
    {
        id:3,
        name:"Company Logo.png",
        category:"Images",
        type:"Image",
        size:"679KB",
        date:"29th Oct 2026"
    },
    {
        id:4,
        name:"Meeting Notes.docx",
        category:"Work",
        type:"Word",
        size:"420KB",
        date:"30th Oct 2026"

    },
    {
        id:5,
        name:"User Requirements",
        category: "Projects",
        type: "PDF",
        size: "1.2",
        date: "28th Oct 2026",

    },
    {
        id:6,
        name: "Budget 2026.xlsx",
        category:"Finance",
        type:"Excel",
        size:"760KB",
        date:"25th Oct 2026"
    },
];
const fileIcons = {
    PDF: FileText,
    Excel: FileSpreadsheet,
    Image: FileImage,
    Word: File
};

const fileColors = {
    PDF: "text-red-500 bg-red-50 dark:bg-red-500/10",
    Excel: "text-green-600 bg-green-50 dark:bg-green-500/10",
    Image: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
    Word: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
};

export default function Documents(){
    const navigate = useNavigate();
    const [documents, setDocuments] = useState(sampleDocuments);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All categories");
    const [view, setView] = useState("list");
    const filteredDocuments = useMemo(()=>{
        return documents.filter((document)=>{
            const matchesSearch = document.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory =category ==="All categories" || document.category ===category;
            return matchesSearch && matchesCategory;
        });
    },
    [documents, search,category]
);
   const handleDelete = (id) =>{
    const confirmed = window.confirm("Are you sure you want to move this document to trash?");
    if (confirmed){
        setDocuments((current)=> current.filter((document)=> document.id !==id));
    }
   };

   return (
    <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <h1 className="text-3xl font-bold">All Documents</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">Manage and Organise your documents in one place</p>
            </div>
            <button onClick={()=> navigate("upload")} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg:bg-indigo-700">
                <Upload size={18}/> Upload Document
            </button>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-500 dark:bg-slate-900 md:flex-row">
            <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-3.5 text-slate-400"/>
                <input value={search} onChange={(event)=> setSearch(event.target.value)} placeholder="Search documents..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800"/>

            </div>
            <div className="flex items-center gap-2">
                <Filter size={18} className="text-slate-400"/>
                <select value={category} onChange={(event)=>
                    setCategory(event.target.value)
                } className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-800">
                 <option>All categories</option>
                 <option>Projects</option>
                 <option>Finance</option>
                 <option>Images</option>
                 <option>Work</option>  
                </select>
                <button onClick={()=> setView("list")} className={`rounded-lg p-2 ${view=== "list" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                aria-label="List View"> <List size={20}/></button>
                <button onClick={() => setView("grid")} className={`rounded-lg p-2 ${view=== "grid" ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
                aria-label="Grid View"><Grid2X2 size={20}/></button>
            </div>
        </div>
        <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 dark:text-slate-400">{filteredDocuments.length} Documents Found</p>
        </div>
        {filteredDocuments.length === 0 ?(
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                <FileText className="mx-auto mb-4 text-slate-400" size="40"/>
                <h2 className="text-lg font-semi-bold">No Documents Found</h2>
                <p className="mt-2 text-sm text-sm text-slate-500">Try Changing Your Search or Category Filter</p>
            </div>
        ) : view === "list" ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        <tr>
                            <th className="px-5 py-4">Document</th>
                            <th className="px-5 py-6">Category</th>
                            <th className="px-5 py-6">Modified</th>
                            <th className="px-5 py-6">Size</th>
                            <th className="px-5 py-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocuments.map((document) => {
                            const Icon = fileIcons[document.type] || File;
                            return(
                                <tr key={document.id} className="border-t border-slate-100 dark:border-slate-800">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`rounded-lg p-2 ${fileColors[document.type]}`}>
                                                <Icon size={20}/>
                                            </div>
                                            <span className="font-medium">{document.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-slate-500">{document.category}</td>
                                    <td className="px-5 py-4 text-slate-500">{document.date}</td>
                                    <td className="px-5 py-4 text-slate-500">{document.size}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={()=> alert(`Preview: ${document.name}`)} title="Preview" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <Eye size={17}/>
                                            </button>
                                            <button onClick={()=> alert(`Download: ${document.name}`)} title="Download" className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                                                <Download size={17}/>
                                            </button>
                                            <button onClick={() => handleDelete(document.id)} title="Delete" className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red/10">
                                               <Trash2 size={17}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        ) : (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredDocuments.map((document) =>{
            const Icon = fileIcons[document.type] || File;
            return (
                <div key={document.id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-start justify-between">
                        <div className={`rounded-xl p-3 ${fileColors[document.type]}`}>
                            <Icon size={25}/>
                        </div>
                        <button onClick={()=> handleDelete(document.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" aria-label={`Delete ${document.name}`}>
                            <Trash2 size={18}/>
                        </button>
                    </div>
                    <h3 className="mt-4 break-words font-semibold">{document.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{document.category} . {document.size}</p>
                    <p className="mt-1 text-xs text-slate-400">Modified {document.date}</p>
                    <div className="mt-4 flex gap-2">
                        <button onClick={()=>alert(`Preview: ${document.name}`)} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            <Eye size={16}/>
                            Preview
                        </button>
                        <button onClick={()=> alert(`Download: ${document.name}`)} className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm text-white hover:bg-indigo-700">
                            <Download size={16}/> Download
                        </button>
                    </div>
                </div>
            );
        })}
    </div>
   )}
    </div>
   )  

}