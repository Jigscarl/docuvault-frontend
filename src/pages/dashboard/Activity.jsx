import { useEffect, useMemo, useState, useCallback } from "react";
import { Activity as ActivityIcon, Upload, Star, Folder, Trash2, RotateCcw, Download, Link as LinkIcon, Loader2, AlertCircle, FileText,Search, RefreshCcw } from "lucide-react";
import activityApi from "../../api/activityApi";
const actionConfig = {
    Uploaded: {icon: Upload, color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"},
    Favorited: {icon: Star, color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"},
    Unfavorited: {icon: Star, color: "bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400"},
    Moved: {icon : Folder, color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"},
    "Moved to Trash": {
        icon: Trash2, color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"},
    Restored: {icon: RotateCcw, color:"bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"},
    "Permanently Deleted": {icon:Trash2, color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"},
    "Download Link Created": {icon: LinkIcon, color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"}
};

function formatDate(dateString){
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())){
        return "Unknown date";
    }
    return date.toLocaleString(undefined, {dateStyle:"medium", timeStyle:"short"});
}
function getDateGroup(dateString){
    const date = new Date(dateString);
    const now = new Date();
    if(Number.isNaN(date.getTime())){
        return "Unknown date";
    }
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    if(date >= startOfToday){
        return "Today";
    }

    if (date >= startOfYesterday && date < startOfToday){return "Yesterday";}

    return date.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export default function Activity(){
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [searchTerm, setSearchTerm] =useState("");
    const [dateFilter, setDateFilter] = useState("all");
    const [customStartDate, setCustomStartDate] = useState("");
    const [customEndDate, setCustomEndDate] = useState("");

    const fetchActivities = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const data = await activityApi.getRecent(100);
            setActivities(Array.isArray(data)? data : []);
        } catch (err){
            console.error("Activity loading error:", err);
            setError(err.response?.data?.message || "Unable to load activity history. Please try again");
        } finally {
            setLoading(false);
        }
    }, []);
    
    const filteredActivities = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        const now = new Date();
        let startDate = null;
        let endDate = null;

        if (dateFilter ===  "7"){
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 7);
        } else if (dateFilter === "30"){
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 30);
        } else if (dateFilter === "90"){
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 90);
        } else if (dateFilter === "custom"){
            if (custormStartDate){
                startDate = new Date(`${customStartDate} T00:00:00`);
            }
            if(customEndDate){
                endDate = new Date(`${customEndDate} T23:59:59.999`);
            }
        }

        return activities.filter((activity) => {
            const activityDate = new Date(activity.createdAt);
            const matchesFilter = filter === "all" || activity.action === filter;
            const matchesSearch = !query || activity.documentName?.toLowerCase().includes(query) || activity.action?.toLowerCase().includes(query) || activity.details?.toLowerCase().includes(query);
            const matchesDate = (!startDate || activityDate >= startDate) && (!endDate || activityDate <= endDate);

            return matchesFilter && matchesSearch && matchesDate;
        });
    }, [activities, filter, searchTerm, dateFilter, customStartDate, customEndDate]);


    const totalPages = Math.max(
        1, Math.ceil(filteredActivities.length / pageSize)
    );
    const paginatedActivities = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;

        return filteredActivities.slice(startIndex, startIndex + pageSize);
    }, [filteredActivities, currentPage]);

    const groupedActivities = useMemo(() => {
        return paginatedActivities.reduce((groups, activity) => {
            const group = getDateGroup(activity.createdAt);
            if (!groups[group]) {
                groups[group] = [];
            }
            groups[group].push(activity);
            return groups;
        }, {});
    }, [paginatedActivities]);

    useEffect(() => {
        void Promise.resolve().then(fetchActivities);
    }, [fetchActivities]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                    <Input type="text" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} placeholder="Search activity..." className="w-full rounded-lg  border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 outline-none
                    transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 sm:w-56"/>

                </div>
                <select value={filter} onChange={(e) => {setFilter(e.target.value); setCurrentPage(1);}}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                    <option value="all">All activities</option>
                    <option value="Uploaded">Uploads</option>
                    <option value="Favorited">Favorited</option>
                    <option value="Unfavorited">Unfavorited</option>
                    <option value="Moved">Folder movements</option>
                    <option value="Moved to Trash">Moved to trash</option>
                    <option value="Restored">Restored</option>
                    <option value="Download Link Created">Downloads</option>
                    <option value="Permanently Deleted">Permanent delections</option>
                </select>
                <select value={dateFilter} obnChange={(e) => {setDateFilter(e.target.value); setCurrentPage(1);}}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">

                    <option value="all">All time</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="custom">Custom range</option>
                </select>

                <button onClick={fetchActivities} disabled={loading} className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""}/>
                </button>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
                {loading? (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                        <Loader2 size={30} className=" animate-spin text-indigo-600"/>
                        <p className="text-sm text-gray-500">Loading activity history...</p>
                    </div>
                ): error ? (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                        <AlertCircle size={32} className="text-red-500"/>
                        <p className="text-sm text-red-500">{error}</p>
                        <button onClick={fetchActivities} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                            Try again
                        </button>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
                        <FileText size={40} className="text-gray-800 dark:text-gray-200"/>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">No activities found</h3>
                        <p className="text-sm text-gray-500">Your document activities will appear here when you start using DocuVault.</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute bottom-4 left-5 top-4 w-px bg-gray-200 dark:bg-gray-700 sm:left-6"/>
                       <div className="space-y-6">
                        {Object.entries(groupedActivities).map(([dateGroup, items]) => (
                            <section key={dateGroup}>
                                <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">{dateGroup}</h3>
                                <div className="relative space-y-1">
                                    <div className="absolute bottom-4 left-5 top-4 w-px bg-gray-200 dark:bg-gray-700 sm:left-6"/>
                                    {items.map((activity) => {
                                        const config = actionConfig[activity.action] || {
                                            icon: Download,
                                            color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                        };
                                        const Icon = config.icon;
                                        return (
                                            <div key={activity.id} className="relative flex gap-4 rounded-xl p-3 transition hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:gap-5 sm:p-4">
                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${config.color}`}>
                                                    <Icon size={18} />
                                                </div>
                                                <div className="min-w-0 flex-1 pt-1">
                                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                                        <div className="min-w-0">
                                                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{activity.action}</h3>
                                                            <p className="mt-0.5 break-words text-sm text-gray-600 dark:text-gray-400">{activity.documentName}</p>
                                                        </div>
                                                        <span className="shrink-0 text-xs text-gray-400">{formatDate(activity.createdAt)}</span>
                                                    </div>
                                                    {activity.details && (
                                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{activity.details}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                       </div>
                    </div>
                )

                }
            </div>
            {!loading && !error && filteredActivities.length > 0 && (
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {""}
                        {(currentPage -1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredActivities.length)} of {" "}
                        {filteredActivities.length} activities
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                            Previous
                        </button>
                        <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                        Page {currentPage} of {totalPages}
                        </span>

                        <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}disabled={currentPage >= totalPages} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
                            Next
                        </button>
                    </div>
                </div>
            )}
            
        </div>
    );
}