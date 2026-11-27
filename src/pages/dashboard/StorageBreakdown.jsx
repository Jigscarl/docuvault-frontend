import { useMemo } from "react";
import { HardDrive, Files } from "lucide-react";
const formatBytes = (bytes) => {
    if(!bytes || bytes <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.min(Math.floor(Math.log(bytes)/ Math.log(1024)), units.length - 1);
    return `${(bytes/Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
};

export default function StorageBreakdown({FileTypes = []}){
    const storageData = useMemo(() => {
        const total = FileTypes.reduce((sum, item) => sum + (Number(item.totalBytes) || 0), 0);
        return FileTypes.map((item) => ({
            extension: item.extension || "OTHER",
            size: Number(item.totalBytes) || 0,
            count: Number(item.count) || 0,
            percentage: total > 0 ? (Number(item.totalBytes)/total) * 100 : 0
        })).sort((a,b)=> b.size - a.size);
    }, [FileTypes]);

    const totalStorage = storageData.reduce((sum, item) => sum + item.size, 0);
    const totalFiles = storageData.reduce((sum, item) => sum + item.count, 0);
    const colors = [
        "bg-indigo-500",
        "bg-emerald-500",
        "bg-amber-500",
        "bg-purple-500",
        "bg-blue-500",
        "bg-rose-500",
        "bg-cyan-500",
        "bg-orange-500"

    ];

    return (
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shaadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">Storage Analytics</h2>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Usage grouped by file type</p>
                </div>
                <div className="rounded-xl bg-indigo-500/10 p-3 text-indigo-500">
                   <HardDrive size={20}/>
                </div>
            </div>
            <div className="mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total storage Used</p>
                <h3 className="mt-1 break-words text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">{formatBytes(totalStorage)}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{totalFiles} files analyzed</p>
            </div>
            {totalStorage > 0 && (
                <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    {storageData.map((item, index) => (
                        <div key={item.extension} className={`${colors[index % colors.length]} transition-all`} style={{width: `${item.percentage}%`}} title={`${item.extension}: ${formatBytes(item.size)}`}/>
                    ))}
                </div>
            )}

            <div className="mt-6 space-y-4">
                {storageData.length === 0 ? (
                    <div className="py-5 text-center">
                        <Files size={25} className="mx-auto text-gray-400"/>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No storage available</p>
                    </div>
                ) : (
                    storageData.slice(0, 6).map((item, index) => (
                        <div key={item.extension} className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <div className={`h-3 w-3 shrink-0 rounded-full ${colors[index % colors.length]}`}/>
                                <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{item.extension}</span>
                            </div>
                            <div className="text-right">
                                <p className="whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{formatBytes(item.size)}</p>
                                <p className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">{item.percentage.toFixed(1)}%</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {storageData.length > 6 && (
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400"> + {storageData.length - 6} more file types </p>
            )}
        </div>
    );
}