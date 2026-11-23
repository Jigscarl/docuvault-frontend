import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Files, Folder, Star, HardDrive,Upload,ArrowRight,FileText,FileImage,FileSpreadsheet,File,Clock,Activity,Loader2,RefreshCw, ArrowUpRight, Subtitles} from "lucide-react"
import documentApi from "../../api/documentApi";
import folderApi from "../../api/folderApi";
import activityApi from "../../api/activityApi";
import CategoryBreakdown from "./categoryBreakdown";

const formatFileSize = (bytes = 0) => {
    if (!bytes || bytes <= 0 ) return "0 B";

    const units = ["8", "KB", "MB", "GB", "TB" ];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`
};

const formatDate = (date) => {
    if(!date) return "-";
    return new Date(date).toLocaleDateString(undefined, {day: "numeric", month: "short", year: "numeric"});
};

const getFileIcon = (name = "") => {
    const extention = name.split(".").pop()?.toLowerCase();
    switch (extention){
        case "pdf":
            return {icon: FileText, color: "text-red-500", bg: "bg-red-500/10"};
        case "png":
        case "jpg":
        case "jpeg":
        case "gif":
        case "webp":
            return {icon: FileImage, color: "text-purple-500", bg: "bg-purple-500/10"};
        case "xls":
        case "xlsx":
        case "csv":
            return {icon: FileSpreadsheet, color: "text-emerald-500", bg: "bg-emerald-500/10"};
        case "doc":
        case "docx":
            return {icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10"};
            
            default:
                return {icon: File, color: "text-gray-500", bg: "bg-gray-500/10"};
    }
};

const getActivityStyle = (action = "") => {
    const normalized = action.toLowerCase();

    if (normalized.includes("upload")){
        return {icon: Upload, color: "text-blue-500", bg: "bg-blue-500/10"};
    }

    if (normalized.includes("favorite")){
        return {icon:Star, color: "text-amber-500", bg: "bg-amber-500/10"}
    }

    if (normalized.includes("download")){
        return {icon:ArrowUpRight, color: "text-amerald-500", bg: "bg-emerald-500/10"}
    }

    if (normalized.includes("folder") || normalized.includes("mov")){
         return {icon: Folder, color: "text-purple-500", bg: "bg-purple-500/10"}
    }

    return {icon: Activity, color: "text-gray-500", bg: "bg-gray-500/10"};
};

const StatCard = ({title, value, Subtitle, icon: Icon, color}) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shodow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start justify-between">
            <div>
                <p className="text=sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{Subtitle}</p>
            </div>
            <div className={`rounded-xl p-3 ${color}`}><Icon size={21}/></div>
        </div>
    </div>
);

export default function Dashboard(){
    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);
    const [folders, setFolders] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const loadDashboard = async () => {
        setLoading(true);
        setError("");

        try{
            const results = await Promise.allSettled([
                documentApi.getAll(),
                folderApi.getAll(),
                activityApi.getRecent(5),
            ]);

            const [documentResult, folderResult, activityResult] = results;

            if (documentResult.status === "fulfilled"){
                setDocuments(Array.isArray(documentResult.value)? documentResult.value : []);
            } else {
                console.error ("Documents failed to load:", documentResult.reason);
                setFolders([]);
            }
            if(activityResult.status === "fulfilled"){
                setActivities(Array.isArray(activityResult.value)? activityResult.value : []);
            } else {
                console.error("Activities failed to load:", activityResult.reason);
                setActivities([]);
            }

            if (documentResult.status === "rejected" && folderResult.status ===" rejected"){
                setError("Unable to load dashboard data. Please try again.")
            }
        } catch (err){
            console.error("Dashboard loading error:", err);
            setError("Something went wrong while loading the dashboard.");
        }finally {
                setLoading(false)
            }
     };

     useEffect(() => {
        loadDashboard();
     }, []);

     const totalDocuments = document.length;
     const totalFolders = folderApi.length;
     const totalFavorites = documents.filter((document) => document.isFavorite === true).length;
     const totalStorage = document.reduce((total, document) => total + (Number(document.sizeBytes) || 0), 0);
     const recentDocuments = [...documents].sort((a,b) => new Date(b.createdAt || 0 ).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5);
     const stats = [
        {
            title: "Total Documents",
            value: totalDocuments.toLocaleString(),
            subtitle:"Documents in your vault",
            icon:Files,
            color: "bg-indigo-500/10 text-indigo-500",
        },
        {
            title: "Total Folders",
            value: totalFolders.toLocaleString(),
            subtitle: "Organized folders",
            icon: Folder,
            color: "bg-blue-500/10 text-blue-500",
        },
        {
            title: "Favorites",
            value: totalFavorites.toLocaleString(),
            subtitle: "Favorite documents",
            icon: Star,
            color:" bg-amber-500/10 text-amber-500",
        },
        {
            title: "Storage Used",
            value: formatFileSize(totalStorage),
            subtitle: "Total uploaded file size",
            icon: HardDrive,
            color: "bg-emerald-500/10 text-emerald-500"
        },
     ];

     return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Here`s an overview of your document workspace</p>
                </div>
                <button onClick={() => navigate("/upload")} className="flex items-center justify-center gap-2 rounded=xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700">
                    <Upload size={18}/>
                    Upload Document
                </button>
            </div>

            {error && (
                <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    <button onClick={loadDashboard} className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
                        <RefreshCw size={15}/>
                        Retry
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {loading ? Array.from({length:4}).map((_, index) => (
                    <div key={index} className="h-[125px] animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900"/>
                )) : stats.map((stat) => <StatCard key= {stat.title}{...stat}/>)}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-2">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                        <div>
                            <h2 className="font-semibold text-gray-900 dark:text-white">Recent Documents</h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Your latest uploaded files</p>
                        </div>
                        <button onClick={() => navigate("/documents")} className="flex items-center gap-1 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400">
                            View all
                            <ArrowUpRight size={16}/>
                        </button>
                    </div>
                    {loading ? (
                        <div className="space-y-4 p-5">
                            {Array.from({length: 4}).map((_, index) => (
                                <div key={index} className="flex animate-pulse items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800"/>
                                    <div className="flex-1 space-y-2">
                                    <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800"/>
                                    <div className="h-2 w-1/3 rounded bg-gray-200 dark:bg-gray-800"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentDocuments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                            <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-500">
                             <Files size={28}/>
                            </div>
                            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">No documents yet</h3>
                            <p className="mt-1 max-w-xs text-sm text-gray-500 dark:text-gray-400">Upload your first document to get started with DocuVault.</p>
                            <button onClick={() => navigate("/upload")} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700">
                                Upload your first document
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[500px]">
                                <thead>
                                    <tr className="bg-gray-50 text-left dark:bg-gray-800/50">
                                     <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Document</th>
                                     <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
                                     <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Date</th>
                                     <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">Size</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {recentDocuments.map((document) => {
                                        const fileStyle = getFileIcon(document.name);
                                        const FileIcon = fileStyle.icon;

                                        return (
                                            <tr key={document.id} className="transition hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`rounded-lg p-2 ${fileStyle.bg} ${fileStyle.color}`}>
                                                            <FileIcon size={18}/>
                                                        </div>
                                                        <span className="max-w-[180px] truncate text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            {document.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                                        {document.category || "Uncategorized"}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {formatDate(document.createdAt)}
                                                </td>
                                                <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {formatFileSize(document.sizeBytes)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-5 py-4 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <Clock size={18} className="text-indigo-500"/>
                            <h2 className="font-semibold text-gray-500 dark:text-gray-400">Recent Activities</h2>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Latest actions in your workspace</p>
                        </div>
                        {loading ? (
                            <div className="space-y-5 p-5">
                                {Array.from({length: 4}).map((_, index) => (
                                    <div key={index} className="flex animate-pulse gap-3">
                                        <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-800"/>
                                        <div className="flex-1 space-y-2 pt-1">
                                            <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-gray-800"/>
                                            <div className="h-2 w-1/2 rounded bg-gray-200 dark:bg-gray-800"/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : activities.length === 0 ? (
                            <div className="flex flex-col items-center px-5 py-12 text-center">
                                <Activity size={26} className="text-gray-400"/>
                                <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    No recent activities yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-0 px-5">
                                {activities.slice(0, 5).map((activity) => {
                                    const activityStyle = getActivityStyle(activity.action);
                                    const ActivityIcon = activityStyle.icon;

                                    return (
                                        <div key={activity.id} className="flex gap-3 border-b border-gray-100 py-4 last:border-0 dark:border-gray-800">
                                            <div className={`h-fit rounded-full p-2 ${activityStyle.bg} $ {activityStyle.color}`}>
                                                <ActivityIcon size={15}/>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.action}</p>
                                                <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{activity.documentName}</p>
                                                {activity.details && (
                                                    <p className="mt-1 line-clamp-2 text-xs text-gray-400">{activity.details}</p>
                                                )}
                                                <p className="mt-2 text-xs text-gray-400">{formatDate(activity.createdAt)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="mb-4 font-semibold text-gray-900 dark:text-white">Quick Access</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            {
                                label: "Documents",
                                icon: Files,
                                path: "/documents",
                                color: "text-indigo-500",
                                bg: "bg-indigo-500/10",
                            },
                            {
                                label: "Folders",
                                icon: Folder,
                                path: "/folders",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10",
                            },
                            {
                                label: "Favorites",
                                icon: Star,
                                path: "/favorites",
                                color: "text-amber-500",
                                bg: "bg-amber-500/10",

                            },
                            {
                                label: "Trash",
                                icon: File,
                                path: "/trash",
                                color: "text-red-500",
                                bg: "bg-red-500/10",
                            },
                        ].map((item) => {
                            const QuickIcon = item.icon;

                            return (
                                <button key={item.label} onClick={() => navigate(item.path)} 
                                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-indigo-300 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-indigo-700">
                                    <div className={`rounded-lg p-2.5 ${item.bg} ${item.color}`}>
                                        <QuickIcon size={20}/>
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <CategoryBreakdown documents={documents}/>
                </div>
            </div>
        </div>
     );
}