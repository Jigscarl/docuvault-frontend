import { useEffect, useState, useCallback } from "react";
import {Users, UserCheck, UserX,ShieldCheck,Files, FolderOpen, Database, RefreshCw, } from "lucide-react";
import adminDashboardApi from "../../api/adminDashboardApi";
import AdminActivityChart from "../../componets/dashboard/AdminActivityChart";
import AdminRecentActivity from "../../componets/dashboard/AdminRecentActivity";

export default function AdminDashboard(){
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [activities, setActivities] =useState([]);
    const [activityLoading, setActivityLOading] = useState(true);
    const [activityError, setActivityError] = useState("");
    const [dateRange, setDateRange] = useState(7);
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentActivityLoading, setRecentActivityLoading] = useState(true);
    const [activityLimit, setActivityLimit] = useState(10);
    const [hasMoreActivity, setHasMoreActivity] = useState(true);
    const [recentActivityError, setRecentActivityError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);
    
    const fetchStats = useCallback(async () => {
       try {
        setLoading(true);
        setError("");

        const data = await adminDashboardApi.getStats();
        setStats(data);
       } catch (err) {

        console.error("Failed to fetch admin statistics:", err);
        setError(
            err.response?.data?.message || "Unable to load dashboard statistics."
        );

       } finally {
        setLoading(false)
       }
    }, []);

    const fetchActivity = useCallback(async (days = dateRange) => {
        try {
            setActivityLOading(true);
            setActivityError("");
            const data = await adminDashboardApi.getDocumentActivity(days);
            setActivities(data);
        } catch (err) {
             console.error("Failed to fetch document activity.", err);

             setActivityError(
                err.response?.data?.message || "Unable to load system activity."
             )
        } finally{
            setActivityLOading(false);
        }
    }, [dateRange]);

    const fetchRecentActivity = useCallback(async (limit = 10) => {
        try {
            setRecentActivityLoading(true);
            setRecentActivityError("");

            const data = await adminDashboardApi.getRecentActivity(limit);
            setRecentActivities(data);
            setHasMoreActivity(data.length === limit);
        } catch (error) {
            console.error("Failed to fetch recent activities:", error);

            setRecentActivityError(
                error.response?.data?.message || "Unable to load recent system activities."
            );
        } finally{
            setRecentActivityLoading(false);
        }
    }, []);

    const loadMoreActivity = async () => {
        const newLimit = activityLimit + 10;
        setActivityLimit(newLimit);
        await fetchRecentActivity(newLimit);
    }

    const refreshDashboard = useCallback(async () => {
        try{
       setRefreshing(true);
       setActivityLimit(10);
       setHasMoreActivity(true);
       await Promise.all([
        fetchStats(),
        fetchActivity(dateRange),
        fetchRecentActivity(10)
       ]);

       setLastUpdated(new Date());
       } finally{
        setRefreshing(false);
       }
    }, [dateRange, fetchStats, fetchActivity, fetchRecentActivity]);

    useEffect(() => {
        refreshDashboard();
    }, [refreshDashboard]);

    const formatStorage = (bytes = 0) => {
        if (bytes === 0) return "0 Bytes";
        const units = ["Bytes", "KB", "MB", "GB", "TB"];
        const index = Math.floor(Math.log(bytes)/ Math.log(1024));

        return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
    };

    const cards = [
        {
            title: "Total Users",
            value: stats?.totalUsers ?? 0,
            icon: Users,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Active Users",
            value: stats?.activeUsers ?? 0,
            icon: UserCheck,
            color: "bg-green-100 text-600"
        },
        {
            title: " Inactive Users",
            value: stats?.inactiveUsers ?? 0,
            icon: UserX,
            color: "bg-red-100 text-red-600"
        },
        {
            title: "AdminStrators",
            value: stats?.totalAdmins ?? 0,
            icon: ShieldCheck,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Regular Users",
            value: stats?.totalRegularUsers ?? 0,
            icon: Users,
            color: "bg-indigo-100 text-indigo-600"
        },
        {
            title: "Total Documents",
            value: stats?.totalDocuments ?? 0,
            icon: Files,
            color: "bg-orange-100 text-orange-600"
        },
        {
            title: "Total Folders",
            value: stats?.totalFolders ?? 0,
            icon: FolderOpen,
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            title: "Storage Used",
            value: formatStorage(stats?.totalStorageBytes ?? 0),
            icon: Database,
            color: "bg-teal-100 text-teal-600"
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Overview of the DocuVault System</p>

                        {lastUpdated && (
                            <span className="text-xs text-slate-400 dark:text-slate-500">  Last updated {lastUpdated.toLocaleTimeString()}</span>
                        )}
                    </div>
                </div>
                
                <button onClick={refreshDashboard} disabled={refreshing || loading || recentActivityLoading} className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                    <RefreshCw size={16} className={refreshing ? "animate-spin" : "" }/>
                    {refreshing ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                    {error}
                    <button onClick={fetchStats} className="ml-2 font-semibold underline">Try again</button>
                </div>
                
            )}
            {loading && !stats ? (
                <div className="flex min-h-60 items-center justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600"/>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {cards.map((card) => {
                        const Icon = card.icon;

                       return(
                        <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{loading ? "..." : card.value}</h2>
                                </div>
                                <div className={`rounded-xl p-3 ${card.color}`}>
                                    <Icon size={23}/>
                                </div>
                            </div>
                        </div>
                       );
                    })}
                </div>
             )}

             <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Systen Activity</h2>
                    <select value={dateRange} onChange={(e) => setDateRange(Number(e.target.value))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                        <option value={7}>Last 7 days</option>
                        <option value={30}>Last 30 days</option>
                        <option value={90}>Last 90 days</option>
                    </select>
                </div>
                {activityLoading ? (
                    <div className="flex h-72 items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"/>
                    </div>
                ) : activityError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
                        <p className="text-sm text-red-700 dark:text-red-400">{activityError}</p>
                        <button onClick={() => fetchActivity(dateRange)} className="mt-3 text-sm font-semibold text-red-700 underline dark:text-red-400">
                            Try again
                        </button>
                    </div>
                ) : (
                    <AdminActivityChart activities={activities}/>
                )}
             </div>
             {recentActivityLoading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading recent activity...</p>
                </div>
             ) : recentActivityError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/30">
                    <p className="text-sm text-red-700 dark:text-red-400">
                        {recentActivityError}
                    </p>
                    <button onClick={fetchRecentActivity} className="mt-3 text-sm font-semibold text-red-700 underline dark:text-red-400">
                        Try again
                    </button>
                </div>
                
             ) : (
                <div className="space-y-4">
                    <AdminRecentActivity activities={recentActivities}/>

                    {hasMoreActivity && recentActivities.length > 0 && (
                        <div className="flex justify-center">
                            <button onClick={loadMoreActivity} disabled={recentActivityLoading} className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800">
                                {recentActivityLoading ? "Loading..." : "Load More Activity"}
                            </button>
                        </div>
                    )}
                </div>
             )}
        </div>
    );
}