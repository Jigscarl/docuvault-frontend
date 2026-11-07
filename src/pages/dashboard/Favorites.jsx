import { useState } from "react";
import { Search, Star, FileText, FileSpreadsheet,FileImage,File,MoreVertical,Download,Trash2 } from "lucide-react";

const initialFavourites = [
    {
        id:1,
        name: "Project Proposal.pdf",
        type: "pdf",
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
        const confirmed = window.confirm('Remove "${document.name}" from favorites?');
        if(confirmed){
            setFavorites((current) => current.filter((item) => item.id !== document.id));
        }
        setMenuDocument(null);
    }

    function downloadDocument(document){
        alert ('Download functionality for ${document.name} will be connected to backend.')
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
        </div>
    )
}