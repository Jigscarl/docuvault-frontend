import { Upload, Download, Trash2, FolderPlus, FileText, Clock, Activity } from "lucide-react";

export default function AdminRecentActivity({ activities = []}){
    const getActionIcon = (action) => {
        const normalized = action?.toLowerCase();
        if (normalized?.includes("upload")) return Upload;
        if(normalized?.includes("download")) return Download;
        if(normalized?.includes("delete") || normalized?.includes("trash")) return Trash2;
        if(normalized?.includes("folder")) return FolderPlus;
        return FileText;
    };

    const getActionColor = (action) => {
        const normalized = action?.toLowerCase();

        if(normalized?.includes("upload")){
            return "bg-green-100 text-green-400";
        }

        if(normalized?.includes("download")){
            return "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
        }

        if(normalized?.includes("delete") || normalized?.includes("trash")){
            return "bg-red-100 text-red-600 dark:bg-red-500/100 dark:text-red-400";
        }

        if(normalized?.includes("restore")){
            return "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
        }

        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
    };

        const formatTime = (date) => {
            const parsedDate = new Date(date);
            if(isNaN(parsedDate.getTime())) return "Unknown date";

            return parsedDate.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short"
            });
        };

     return(
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"><Activity size={20}/></div>
                 <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent System Activities</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Latest actions performed by users</p>
            </div>
        {activities.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center text-slate-400">
              <Clock size={30} className="mb-3"/>
              <p className="text-sm">No Recent Activities Found.</p>
            </div>
        ) : (
            <div className="space-y-4">
            {activities.map((activity) => {
                const Icon = getActionIcon(activity.action);
                return (
                    <div  key={activity.id} className="flex gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${getActionColor(activity.action)}`}>
                    <Icon size={18}/>
                    </div>
                    <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{activity.userName}
                    <span className="font-normal text-slate-500">{" "} {activity.action.toLowerCase()} {" "}</span>
                    </p>
                    <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-400">{activity.documentName}</p>

                    {activity.details && (
                        <p className="mt-1 text-xs text-slate-400">{activity.details}</p>
                    )}
                    <p className="mt-2 text-xs text-slate-400">{formatTime(activity.createdAt)}</p>
                    </div>
                    </div>
                );
            })}
            </div>
        )}
        </div>
     );   
    
}