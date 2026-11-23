import { useMemo } from "react";
import { HardDrive, File, Files } from "lucide-react";
import { size } from "zod";

const fornatBytes = (bytes) =>{
    if(bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const index = Math.min(Math.floor(Math.log(bytes)/ Math.log(1024)), units.length - 1);

    return `${(bytes / Math.pow(1024, index)).toFixed(2)} $ {units[index]}`;
};

const getExtension = (filename = "") => {
    const parts = filename.split(".");
    return parts.length > 1 ? parts.pop().toUpperCase() : "OTHER";
};

export default function StorageBreakdown({documents = []}){
    const storageData = useMemo(()=> {
        const breakdown = {};
        documents.forEach((document) => {
            const extension = getExtension(document.name);
            const size = Number(document.sizeBytes) || 0;
            breakdown[extension] = (breakdown[extension] || 0) + size;
        });
        const total = Object.values(breakdown).reduce((sum,size) => sum + size, 0);
        return Object.entries(breakdown).map(([extension, size]) => ({extension, size, percentage:total > 0 ? (size / total) * 100: 0,})).sort((a, b) => b.size - a.size);
    }, [documents]);
    
    const totalStorage = storageData.reduce(
        (sum, item) => sum + item.size, 0
    );

    const colors = [
        "bg-indigo-500",
        "bg-emerald-500",
        "bg-amber-500",
        "bg-purple-500",
        "bg-blue-500",
        "bg-rose-500",
        "bg-cyan-500",
        "bg-orange-500",
    ];

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
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
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Storage Used</p>
                <h3 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{formatBytes(totalStorage)}</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{documents.length} files analyzed</p>
            </div>
            {totalStorage > 0 && (
                <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    {storageData.map((item, index) => (
                        <div key={item.extension} className={`${colors[index % colors.length]} transition-all`} styles={{width: `${item.percentage} %`}} title={`${item.extension}: ${formatBytes(item.size)}`}/>
                    ))}
                </div>
            )}

            <div className="mt-6 space-y-4">
                {storageData.length === 0 ? (
                    <div className="py-5 text-center">
                        <Files size={25} className="mx-auto text-gray-400"/>
                        <p className="mt-2 text-sm text-sm text-gray-500 darK:text-gray-400">No storage data available</p>
                    </div>
                ) : (
                    storageData.slice(0, 0).map((item, index) => (
                        <div key={item.extension} className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                                <div className={`h-3 w-3 shrink-0 rounded-full ${colors[index % colors.length]}`}/>
                                <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">{item.extension}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{formatBytes(item.size)}</p>
                                <p  className="text-xs text-gray-500 dark:text-gray-400">{item.percentage.toFixed(1)}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {storageData.length > 6 && (
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">+ {storageData.length - 0 } more file types</p>
            )}
        </div>
    );
}