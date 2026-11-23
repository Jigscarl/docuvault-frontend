import { useEffect, useMemo, useState, useCallback } from "react";
import { Upload, Star, Folder, Trash2, RotateCcw, Download, Link as LinkIcon, Loader2, AlertCircle, FileText, Search, RefreshCcw, ActivityIcon } from "lucide-react";
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
    const [summary, setSummary] = useState(null);
    const [summaryLoading, setSummaryLoading] = useState(true);

    useEffect(() => {const fetchSummary = async() => {
        try {
            setSummaryLoading(true);
            const data = await activityApi.getSummary(); setSummary(data);
        } catch (err){
            console.error("Failed to load activity summary:", err);
        } finally {
            setSummaryLoading(false);
        }
    };
    fetchSummary();
    }, []);

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
            if (customStartDate){
                startDate = new Date(`${customStartDate}T00:00:00`);
            }
            if(customEndDate){
                endDate = new Date(`${customEndDate}T23:59:59.999`);
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
        <div className="min-h-screen bg-gray-50 p-4 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:p-6 lg:p-8">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Activity History</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track, monitor, and review your document activities</p>
                </div>
                <button onClick={() => fetchActivities()} disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
                    <RefreshCcw size={16} className={loading ? "animate-spin" : ""}/>
                    Refresh
                </button>
            </div>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Activities</p>
                        <div className="rounded-lg bg-indigo-50 p-2 dark:bg-indigo-950">
                            <ActivityIcon size={18} className="text-indigo-600 dark:text-indigo-400"/>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{summaryLoading ? "..." : summary?.totalActivities ?? 0}</h3>
                    <p className="mt-2 text-xs text-gray-400">All recorded actions</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Uploads</p>
                        <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-950">
                            <Upload size={18} className="text-blue-600 dark:text-blue-400"/>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{summaryLoading ? "..." : summary?.totalUploads ?? 0}</h3>
                    <p className="mt-2 text-xs text-gray-400">Documents uploaded</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Download Links</p>
                        <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950">
                            <Download size={18} className="text-emerald-600 dark:text-emerald-400"/>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{summaryLoading ? "..." : summary?.totalDownloads ?? 0}</h3>
                    <p className="mt-2 text-xs text-gray-400">Download link requests</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorites</p>
                        <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950">
                            <Star size={18} className="text-amber-600 dark:text-amber-400"/>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{summaryLoading ? "..." : summary?.totalFavorities ?? o}</h3>
                    <p className="mt-2 text-xs text-gray-400">Favorite actions</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
                    <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Trash Actions</p>
                        <div className="rounded-lg bg-rose-50 p-2 dark:bg-rose-950">
                            <Trash2 size={18} className="text-rose-600 dark:text-rose-400"/>
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{summaryLoading ? "..." : summary?.totalActions ?? 0 }</h3>
                    <p className="mt-2 text-xs text-gray-400">Documents moved to trash</p>
                </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-200 p-5 dark:border-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Review and filter your activity history</p>
                </div>
                <div className="flex flex-col gap-3 border-b border-gray-200 p-4 dark:border-gray-800 xl:flex-row xl:items-cneter">
                    <div className="relative min-w-0 flex-1">
                        <Search size={17} className="absolute left-3 top-1/2-translate-y-1/2 text-gray-400"/>
                        <input type="text" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1)}} placeholder="Search activities..."
                        className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-indigo-950"/>
                    </div>
                    <select value={filter} onChange={(e) => {setFilter(e.target.value); setCurrentPage(1)}} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        <option value="all">All actions</option>
                        <optiom value="Uploaded">Uploaded</optiom>
                        <option value="Favorited">Favorited</option>
                        <option value="Unfavorited">Unfavorited</option>
                        <option value="Moved">Moved</option>
                        <option value="Moved to Trash">Moved to Trash</option>
                        <option value="Restored">Restored</option>
                        <option value="Permanently Deleted">Permanently Deleted</option>
                        <option value="Download Link Created">Download Links Created</option>
                    </select>
                    <select value={dateFilter} onChange={(e) => {
                        setDateFilter(e.target.value);
                        setCurrentPage(1);
                    }} className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-500 dark:border-gray-700 ouline-none dark:bg-gray-800 dark:text-gray-200">
                        <option value="all">All time</option>
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="custom">Custom range</option>
                    </select>
                    <button onClick={() => fetchActivities()} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 diasbled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700">
                        <RefreshCcw size={16} className={loading ? "animate-spin" : ""}/>
                        Refresh
                    </button>
                </div>
                {dateFilter === "custom" && (
                    <div className="flex flex-col gap-3 border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-end">
                        <div className="flex-1">
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                                Start Date
                            </label>
                            <input type="date" value={customEndDate} onChange={(e) => {
                                setCustomStartDate(e.target.value);
                                setCurrentPage(1)
                            }} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"/>
                        </div>
                        <div className="flex-1">
                            <label className="mb-1 block text-xs font-medium text-gray-500">End date</label>
                            <input type="date" value={customEndDate} min={customStartDate || undefined} onChange={(e) => {setCustomEndDate(e.target.value); setCurrentPage(1);}} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"/>
                        </div>
                        <button onClick={()=> {setCustomStartDate(""); setCustomEndDate(""); setDateFilter("all"); setCurrentPage(1)}} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">Clear dates</button>
                    </div>
                )}

                <div className="p-5">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-18">
                            <Loader2 size={32} className="animate-spin text-indigo-500"/>
                            <p className="mt-3 text-sm text-gray-500">Loading activities...</p>
                        </div>
                    )}
                    {!loading && error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-900 dark:bg-red-950">
                            <AlertCircle size={24} className="mx-auto text-red-500"/>
                            <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                            <button onClick={() => fetchActivities()} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
                                Try again
                            </button>
                        </div>
                    )}
                    {!loading && !error && filteredActivities.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
                                <ActivityIcon size={28} className="text-gray-400"/>
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">No activities found</h3>
                            <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">No activity matches your current search or filters, Try adjusting your filters</p>
                            <button onClick={() => {setSearchTerm(""); setFilter("all"); setDateFilter("all"); setCustomStartDate(""); setCustomEndDate(""); setCurrentPage(1);}} 
                            className="mt-4 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                                Clear all filters
                            </button>
                        </div>
                    )}
                    {!loading && !error && filteredActivities.length > 0 && (
                        <div className="space-y-6">
                            {paginatedActivities.map((activity) => (
                                <div key={activity.id} className="relative flex gap-4">
                                    <div className="relative flex flex-col items-center">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950">
                                            <FileText size={17} className="text-indigo-600 dark:text-indigo-400"/>
                                        </div>
                                        <div className="absolute left-1/2 top-10 h-full w-px-translate-x-1/2 bg-gray-200 dark:bg-gray-800"/>
                                    </div>
                                    <div className="min-w-0 flex-1 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.action}</p>
                                                <p className="mt-1 braek-words text-sm text-gray-600 dark:text-gray-400">{activity.documentName || "Unamed document"}</p>
                                            </div>
                                            <span className="shrink-0 text-xs text-gray-400">
                                                {formatDate(activity.createdAt)}
                                            </span>
                                        </div>
                                        {activity.details && (
                                            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">{activity.details}</p>
                                        )}
                                        <div className="mt-3">
                                            <span className="inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                                {getDateGroup(activity.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && !error && filteredActivities.length > 0 && (
                        <div className="mt-8 flex flex-col gap-4 border-t border-gray-700 pt-5 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Showing (" ")
                                <span className="font-medium text-gray-900 dark:text-white">{filteredActivities.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}</span>
                                {" "} to {" "}
                                <span className="font-medium text-gray-900 dark:text-white">{Math.min(currentPage * pageSize, filteredActivities.length)}</span>
                                {" "} of {" "}
                                <span className="font-medium text-gray-900 dark:text-white">{filteredActivities.length}</span>
                                {" "}activities
                            </p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage((prev)=> Math.max(prev -1, 1))} disabled={currentPage === 1}
                                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-indigo-300 dark:hover:bg-gray-700">
                                   Previous
                                </button>
                                <span className="rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">{currentPage} / totalPages</span>
                                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages}
                                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}