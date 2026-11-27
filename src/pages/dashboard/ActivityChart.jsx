import { Activity, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export default function ActivityChart({dailyUploads = []}){
    const chartData = useMemo(() => {
        return dailyUploads.map((item) => {
            const date = new Date(item.date);
            return {
                timestamp: date.getTime(),
                label: date.toLocaleDateString(undefined, {weekday: "short"}), fullDate: date.toLocaleDateString(undefined, {day: "numeric", month: "short", year: "numeric"}),
                uploads: Number(item.count) || 0
            };
        }).sort((a, b) => a.timestamp - b.timestamp);
    }, [dailyUploads]);

    const totalUploads = chartData.reduce((sum, item) => sum + item.uploads, 0);
    const peak = chartData.reduce(
        (max, item) => item.uploads > max.uploads ? item : max,
        {label: "-", uploads: 0}
    );
    const maxUploads = Math.max(...chartData.map((item) => item.uploads), 1);

    return (
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Upload Activity</h2>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Daily uploads over the last 7 days</p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500"><Activity size={20}/></div>

            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Uploads in period</p>
                  <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{totalUploads}</h3>
                </div>
                <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800/60">
                 <p className="text-xs text-gray-500 dark:text-gray-400">Peak Day</p>
                 <h3 className="mt-1 flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
                    <TrendingUp size={18} className="text-emerald-500"/>
                    {peak.Uploads}
                 </h3>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{peak.label}</p>
                </div>
            </div>
            <div className="mt-6 overflow-x-auto pb-2">
                <div className="flex h-48 w-full items-end gap-2">
                    {chartData.map((item, index) => {
                        const height = (item.uploads / maxUploads) * 100;
                        return (
                            <div key={index} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.uploads}</span>
                                <div className="flex h-36 w-full items-end overflow-hidden rounded-t-lg bg-gray-100 dark:bg-gray-800">
                                    <div className="w-full rounded-t-lg bg-indigo-500 transition-all duration-500" style={{height: `${height}%`}} title={`${item.fullDate}: ${item.uploads} uploads`}/>

                                </div>
                                <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                            </div>
                        );
                    })}
                </div>
                {chartData.length === 0 && (
                    <p className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">No upload analytics available</p>
                )}
            </div>
        </div>
    );
}